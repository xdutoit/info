$(function(){
 // création tableau
 for(var l=0;l<9;l++){
  $('<tr></tr>').addClass('tr_'+l).appendTo('#sud_table');
  for(var c=0;c<9;c++){
   var blk = Math.floor(l/3)*3+Math.floor(c/3);
   var cls='';
   if(blk%2)
    cls=' tdgr';
   $('<td></td>').addClass('td_'+l+'_'+c+cls).appendTo('.tr_'+l);
   $('<input />').addClass('lin_'+l+' col_'+c+' blk_'+blk).appendTo('.td_'+l+'_'+c);
  }
 }
 
 // bouton
 $('#solve').click(solve);
 
 // remplissage tableau
 
 // sudoku difficile
 $('.lin_0.col_0').val(5);
 $('.lin_0.col_1').val(3);
 $('.lin_0.col_4').val(7);
 $('.lin_1.col_0').val(6);
 $('.lin_1.col_3').val(1);
 $('.lin_1.col_4').val(9);
 $('.lin_1.col_5').val(5);
 $('.lin_2.col_1').val(9);
 $('.lin_2.col_2').val(8);
 $('.lin_2.col_7').val(6);
 
 $('.lin_3.col_0').val(8);
 $('.lin_3.col_4').val(6);
 $('.lin_3.col_8').val(3);
 $('.lin_4.col_0').val(4);
 $('.lin_4.col_3').val(8);
 $('.lin_4.col_5').val(3);
 $('.lin_4.col_8').val(1);
 $('.lin_5.col_0').val(7);
 $('.lin_5.col_4').val(2);
 $('.lin_5.col_8').val(6);
 
 $('.lin_6.col_1').val(6);
 $('.lin_6.col_6').val(2);
 $('.lin_6.col_7').val(8);
 $('.lin_7.col_3').val(4);
 $('.lin_7.col_4').val(1);
 $('.lin_7.col_5').val(9);
 $('.lin_7.col_8').val(5);
 $('.lin_8.col_4').val(8);
 $('.lin_8.col_7').val(7);
 $('.lin_8.col_8').val(9);
 // 
 
 /*
 // test 20 minutes
 $('.lin_0.col_1').val(6);
 $('.lin_0.col_2').val(5);
 $('.lin_0.col_3').val(9);
 $('.lin_0.col_5').val(1);
 $('.lin_0.col_7').val(7);
 $('.lin_1.col_5').val(8);
 $('.lin_1.col_6').val(5);
 $('.lin_2.col_1').val(4);
 $('.lin_2.col_2').val(3);
 $('.lin_2.col_8').val(1);
 
 $('.lin_3.col_1').val(1);
 $('.lin_3.col_3').val(5);
 $('.lin_4.col_2').val(8);
 $('.lin_4.col_6').val(3);
 $('.lin_5.col_5').val(2);
 $('.lin_5.col_7').val(6);
 
 $('.lin_6.col_0').val(3);
 $('.lin_6.col_6').val(8);
 $('.lin_6.col_7').val(2);
 $('.lin_7.col_2').val(9);
 $('.lin_7.col_3').val(8);
 $('.lin_8.col_1').val(8);
 $('.lin_8.col_3').val(6);
 $('.lin_8.col_5').val(3);
 $('.lin_8.col_6').val(4);
 $('.lin_8.col_7').val(5);
 // */
});

function solve(){
	$('.newSol').removeClass('newSol');
 
 // calculer aleurs potentielles
 updateSolved();
 addDataAttr();
 
 // compléter dernière valeurs possibles
 for(var c=0;c<9;c++){
		for(var l=0;l<9;l++){
   if($('.lin_'+l+'.col_'+c).hasClass('unsolved')){
    var pot_str = $('.lin_'+l+'.col_'+c).attr('data-pot');
    var pot = -1;
			 var numPot = 0;
			 for(var i=0;i<9;i++){
			 	if(pot_str.charAt(i)=='0'){
			 		pot=i+1;
			 		numPot++;
			 	}
			 }
    if(numPot==1){
			 	console.log("ligne "+(l+1)+" / colonne "+(c+1)+" : "+pot+" (dernière possibilité)");
			 	$('.lin_'+l+'.col_'+c).val(pot).addClass('newSol');
			 }
   }
  }
 }
 
 // compléter seule valeur possible
 var sel = ['.lin_','.col_','.blk_'];
 var sel2 = ['ligne','colonne','bloc'];
 for(var t=0;t<3;t++){
  for(var x=0;x<9;x++){
   var cls = sel[t]+x+'.unsolved';
   var elems = $(cls);
   var str_arr = [];
   for(var i=0;i<elems.length;i++){
    str_arr[i] = $(elems[i]).attr('data-pot');
   }
   for(var n=0;n<9;n++){
    var numPot = 0;
    var pot = -1;
    for(var s=0;s<elems.length;s++){
     if(str_arr[s].charAt(n)=='0'){
      pot = s;
      numPot++;
     }
    }
    if(numPot==1){
	 			console.log(sel2[t]+" "+(x+1)+" / elem "+(pot+1)+" : "+(n+1)+" (seule possibilité)");
     $(elems[pot]).val(n+1).addClass('newSol');
    }
   }
  }
  
 }
 
 if(!$('.newSol').length){
  updateSolved();
  if(!$('.unsolved').length){
		 alert('FINI');
  }
  else{
		 alert('Bloqué :(');
  }
 }
 
 /*
	
 // vérifier si dernière valeur possible
	var unSolved = false;
	for(var c=0;c<9;c++){
		for(var l=0;l<9;l++){
			if($('.lin_'+l+'.col_'+c).val().length==0){
				var str = getInputPotentials(l,c);
				var pot = -1;
				var numPot = 0;
				for(var i=0;i<9;i++){
					if(str.charAt(i)=='0'){
						pot=i+1;
						numPot++;
					}
				}
				if(numPot==1){
					console.log("ligne "+(l+1)+" / colonne "+(c+1)+" :"+pot);
					$('.lin_'+l+'.col_'+c).val(pot).addClass('newSol');
				}
				else{
					if(numPot==0){
						alert('ERREUR\nligne '+(l+1)+', colonne '+(c+1));
					}
					else{
						unSolved = true;
					}
				}
			}
		}
	}
 
 // parcourir ligne, col, bloc: il faut au moins un 1, etc.
	
	if(!unSolved){
		alert('FINI');
	}*/
}

function addDataAttr(){
 for(var c=0;c<9;c++){
		for(var l=0;l<9;l++){
   if($('.lin_'+l+'.col_'+c).hasClass('unsolved')){
    $('.lin_'+l+'.col_'+c).attr('data-pot',getInputPotentials(l,c));
   }
  }
 }
}

function updateSolved(){
 for(var c=0;c<9;c++){
		for(var l=0;l<9;l++){
   if($('.lin_'+l+'.col_'+c).val().length){
    $('.lin_'+l+'.col_'+c).removeClass('unsolved');
   }
   else{
    $('.lin_'+l+'.col_'+c).addClass('unsolved');
   }
  }
 }
}

function getClassStatus(cls){
 // retourne un string de 0 et 1: les 1 sont les nbs déjà présents	
 var vals = '000000000'.split('');
 var v;
 
 $('.'+cls).each(function(){
  if(v=$(this).val()){
   vals[v-1]='1';
  }
 });
 
 return vals.join('');
}

function getInputPotentials(l,c){
	// retourne un string avec des 0 et 1: les 0 sont les possibilités
	var b = Math.floor(l/3)*3+Math.floor(c/3);
	return combine(getClassStatus('lin_'+l),getClassStatus('col_'+c),getClassStatus('blk_'+b))
}

function combine(str1, str2, str3){
 var strC = '111111111'.split('');
 for(var i=0;i<9;i++){
  if(str1.charAt(i)=='0' && str2.charAt(i)=='0' && str3.charAt(i)=='0'){
   strC[i]='0';
  }
 }
 return strC.join('');
}

/*function isAllowed(str,val){
 // retourne true si le string contient un 0 à l'indice val-1
 var str2=str.split('');
 return str2[val-1]==0;
}*/

