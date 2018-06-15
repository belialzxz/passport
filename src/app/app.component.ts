import { Component, OnInit, OnDestroy} from '@angular/core';
import {Message} from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

import { NodeService } from './services/node.service';
import {Node} from '../models/node.model';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  msgs: Array<Message> = [];

  fileTree: Array<Node> = [];
  selectedNode: Node = {};
  numRange: Array<number> = [1,1];
  isRoot: boolean = false;
  nodeLabel: string = "";
  leafCount: number = 0;

  sub: Subscription;

  constructor(private nodeService:NodeService){}

  ngOnInit(){

    this.sub = this.nodeService.getDataStream().subscribe((data) => {
      this.fileTree = data;
    },
    error => {
      this.msgs = []
      console.error('Error receiving data from Data Stream ', error);
      this.msgs.push({severity: 'error', summary: 'Data Stream Error', detail: 'There was an error with the Data Stream to the server.'})
    }
  );

  this.nodeService.getNodes().subscribe((data) => {
    this.fileTree = data;
  },
  error => {
    this.msgs = []
    console.error('Error retriving Nodes from Server ', error);
    this.msgs.push({severity: 'error', summary: 'Data Retrieval Error', detail: 'There was an error retrieving data from the server.'})
  }
);


  }

  createNode(event, overlay: OverlayPanel){
    let dupe: Boolean = this.dupeCheck();
    if(dupe){
      this.msgs = [];
      this.msgs.push({severity: 'error', summary:'Duplicate Label', detail: 'Node Labels must be unique'});
    }
    else{
    this.selectedNode.children.push({
      label: this.nodeLabel,
      parentId: this.selectedNode._id,
      low: this.numRange[0],
      high: this.numRange[1],
      children: []
    });

    this.nodeService.updateNode(this.selectedNode).subscribe((resp) => {
    //clear numRange.
    this.numRange = [1,1];

    //close overlay
    overlay.hide();
    this.selectedNode.expanded = true;

    this.msgs = [];
    this.msgs.push({severity: 'success', summary:'Node Created', detail: 'Node: '+this.nodeLabel +' has been created.'});
    },
    error => {
      this.selectedNode.children.pop();
      if(this.selectedNode.children.length == 0)
        this.selectedNode.expanded = false;
        console.error('Error updating nodes ', error);
      this.msgs.push({severity: 'error', summary:'DB Update Error', detail: 'There was an error updating the DB.'});
    }
    );

  }

  }

  generateNodes(event, overlay: OverlayPanel){
    this.selectedNode.children = [];
    for(let i = 1; i <= this.leafCount; i++){
      let randomLabel = Math.floor(Math.random() * (this.selectedNode.high - this.selectedNode.low +1) + this.selectedNode.low);
      this.selectedNode.children.push({
        label: randomLabel,
        leaf: true,
        parentId: this.selectedNode._id
      });

      this.selectedNode.expanded = true;

     }

    
    

    this.msgs = [];
   
    
    //Due to how DB is designed, we will always be updating the Root node.
    this.nodeService.updateNode(this.fileTree[0]).subscribe((resp) => {
      this.msgs.push({severity: 'success', summary:'Nodes Generated', detail: this.leafCount+' child nodes generated for: '+this.selectedNode.label});
      this.selectedNode.expanded = true;
      overlay.hide();  
    },
      error =>{ 
        this.selectedNode.children = [];
        console.error('Error updating nodes ', error);
        this.msgs.push({severity: 'error', summary:'DB Update Error', detail: 'There was an error updating the DB.'});}
    );
  }

  onEditNode(event, overlay: OverlayPanel){
    this.msgs = [];
    if(this.selectedNode.children.length > 0)
      this.selectedNode.expanded = true;

    this.nodeService.updateNode(this.fileTree[0]).subscribe((resp) => {
      this.msgs.push({severity: 'success', summary: 'Node updated.'});
      overlay.hide();
      },
      error => {
        console.error('Error updating nodes ', error);
        this.msgs.push({severity: 'error', summary:'DB Update Error', detail: 'There was an error updating the DB.'});
      }
    );
    
  }

  onDeleteNode(event, overlay: OverlayPanel){
    let parent:Node = this.findParent(this.selectedNode.parentId);
    let oringalChildren: Array<Node> = _.cloneDeep(parent.children);
    parent.children = parent.children.filter((node) => node != this.selectedNode);
    if(parent.children.length == 0)
      parent.expanded = false;
    this.msgs = [];

    this.nodeService.updateNode(this.fileTree[0]).subscribe((resp) => {
      overlay.hide();
    
    this.msgs.push({severity: 'success', summary: 'Node Deleted'});
    },
    error => {
      parent.children = oringalChildren;
      console.error('Error deleting node ', error);
      this.msgs.push({severity: 'error', summary:'DB Update Error', detail: 'There was an error updating the DB.'}); 
    }
    );

    
  }

  nodeSelect(event, overlay: OverlayPanel, node: Node){
    event.stopPropagation();
    this.selectedNode = node;
    
    if(!this.selectedNode.leaf){
      this.isRoot = this.selectedNode.label == 'Root';
      overlay.toggle(event, event.srcElement);
    }
    else {
      
      this.msgs = [];
      this.msgs.push({severity:'info', summary:'No Actions available', detail:'No actions available for leaf nodes.'});
    }
  }

  onClick(event, node: Node){
    if(node.parentId == undefined && !node.expanded == false)
      this.collapseAll(node);
    else
      node.expanded = !node.expanded;

    event.stopPropagation();
  }

  dupeCheck(){
     let node: Node = this.selectedNode.children.find((node) => node.label.toLowerCase() == this.nodeLabel.toLowerCase());
     return node != undefined;
  }

  findParent(id: String): Node {
   let parent: Node = this.fileTree.find((node) => node._id == id);
   if(parent == undefined){
     parent = this.fileTree[0].children.find((node) => node._id == id);
   }
   return parent;
  }

  resetOverLay(){
    this.nodeLabel = "";
    this.numRange = [1,1];
    this.leafCount = 0;
  }

  collapseAll(node: Node){
    for(let child of node.children){
      child.expanded = false;
    }
    node.expanded = false;
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.nodeService.closeResources();
  }
}
