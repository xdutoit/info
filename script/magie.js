var ctx;

var ncells = [4,4]; // nombre de cellules
var dims = [ncells[0]*50,ncells[1]*50]; // dimensions du canvas
var celldims = []; // dimensions d'une cellule

var etat;
var indices;

$(function(){
  ctx = $('#container')[0].getContext('2d');

  // init calculs
  celldims[0] = Math.round(dims[0]/ncells[0]);
  celldims[1] = Math.round(dims[1]/ncells[1]);

  // init etat
  etat = new Array(ncells[0]);
  for (var x=0;x<ncells[0];x++){
    etat[x]=new Array(ncells[1]);
  }
  noir();
  
  // init indices
  indices = [[5,13,9,1],[7,15,11,3],[6,14,10,2],[4,12,8,0]];

  // init listener
  $('#container').click(souris);
  $('#prep').click(rendreValable);
});

function noir(){
 /* rend toutes les cases noires */
 for (var x=0;x<ncells[0];x++){
  for(var y=0;y<ncells[1];y++){
   etat[x][y]=0;
  }
 }
 dessinerCellules();
}

function dessinerCellules(){
 /* met à jour le dessin des cases */
 ctx.lineWidth = 1;
 ctx.strokeStyle = '#999999';
 for(var x=0;x<ncells[0];x++){
  for(var y=0;y<ncells[1];y++){
   if(etat[x][y]){
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
 /* change la couleur de la case cliquée */
 var x = Math.floor(e.offsetX/celldims[0]);
 var y = Math.floor(e.offsetY/celldims[1]);

 if(x>=0 && x<=ncells[0] && y>=0 && y<=ncells[1]){
  etat[x][y]=1-etat[x][y];
  dessinerCellules();
 }
}

function dec2bin(num,len){
 /* transforme un nombre en un string binaire (de longueur len) */
 str = num.toString(2);
 if(len){
  while(str.length<len){
   str = '0'+str;
  }
 }
 return str;
}

function rendreValable(){
 /* calcule la parité et transforme en un "mot" valable */
 
 // calcul de la parité
 parite_binaire = 0; // représentation de la parité en nombre binaire (initialement: 0000)
 
 for(var x=0;x<4;x++){
  for(var y=0;y<4;y++){
   if(etat[x][y]){
    parite_binaire^=indices[x][y];
    console.log('cellule '+x+' '+y+' active (indice:'+indices[x][y]+'), parité devient '+parite_binaire);
   }
  }
 }
 
 // rendre le "mot" valable
 for(var x=0;x<4;x++){
  for(var y=0;y<4;y++){
   if(indices[x][y]==parite_binaire){
    etat[x][y]=1-etat[x][y];
    console.log('changement de la case '+x+' '+y+' (indice:'+indices[x][y]+')');
   }
  }
 }
 
 dessinerCellules();
 
}