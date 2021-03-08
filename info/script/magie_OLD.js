var ctx;

var ncells = [4,4]; // nombre de cellules
var dims = [ncells[0]*50,ncells[1]*50]; // dimensions du canvas
var celldims = []; // dimensions d'une cellule

var state;
var indices;

$(function(){
  ctx = $('#container')[0].getContext('2d');

  // init calculs
  celldims[0] = Math.round(dims[0]/ncells[0]);
  celldims[1] = Math.round(dims[1]/ncells[1]);

  // init state
  state = new Array(ncells[0]);
  for (var x=0;x<ncells[0];x++){
    state[x]=new Array(ncells[1]);
  }
  noir();
  
  // init indices
  indices = [[5,1,9,13],[4,0,8,12],[6,2,10,14],[7,3,11,15]];

  // init listener
  $('#container').click(souris);
  $('#prep').click(rendreValable);
});

function noir(){
  for (var x=0;x<ncells[0];x++){
    for(var y=0;y<ncells[1];y++){
      state[x][y]=0;
    }
  }
  dessinerCellules();
}

function dessinerCellules(){
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#999999';
  for(var x=0;x<ncells[0];x++){
    for(var y=0;y<ncells[1];y++){
      if(state[x][y]){
        ctx.fillStyle = '#FFFFFF';
      }
      else{
        ctx.fillStyle = '#000000';
      }
      ctx.strokeRect(x*celldims[0],y*celldims[1],celldims[0],celldims[1]);
      ctx.fillRect(x*celldims[0],y*celldims[1],celldims[0],celldims[1]);
    }
  }
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.rect(0,0,dims[0],dims[1]);
  ctx.stroke();
}

function souris(e){
  var x = Math.floor(e.offsetX/celldims[0]);
  var y = Math.floor(e.offsetY/celldims[1]);

  if(x>=0 && x<=ncells[0] && y>=0 && y<=ncells[1]){
    state[x][y]=1-state[x][y];
    dessinerCellules();
  }
}

function rendreValable(){
 // parité 1
 var p1=1;
 for(var y=0;y<=1;y++){
  for(var x=0;x<4;x++){
   p1+=state[x][y];
  }
 }
 console.log('parité 1:'+p1);
 // parité 2
 var p2=1;
 for(var y=1;y<=2;y++){
  for(var x=0;x<4;x++){
   p2+=state[x][y];
  }
 }
 console.log('parité 2:'+p2);
 // parité 3
 var p3=1;
 for(var y=0;y<4;y++){
  for(var x=0;x<=1;x++){
   p3+=state[x][y];
  }
 }
 console.log('parité 3:'+p3);
 // parité 4
 var p4=1;
 for(var y=0;y<4;y++){
  for(var x=1;x<=2;x++){
   p4+=state[x][y];
  }
 }
 console.log('parité 4:'+p4);
 
 // modulo
 p1%=2;
 p2%=2;
 p3%=2;
 p4%=2;
 console.log('indice à changer:'+p1+p2+p3+p4);
 
 ind2change = parseInt(''+p1+p2+p3+p4,2);
 
 console.log(ind2change);
 
 for(var x=0;x<4;x++){
  for(var y=0;y<4;y++){
   if(indices[x][y]==ind2change){
    state[x][y]=1-state[x][y];
   }
  }
 }
 
 dessinerCellules();
 
}