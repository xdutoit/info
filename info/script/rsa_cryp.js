$(function(){
 // listener
 $('#btn_trans').click(de_crypt);
});

function de_crypt(){
 // séquence à (dé)crypter
 var txt_in = $('#ta_in').val();
 var arr_in = txt_in.split('.');
 var nbs_in = arr_in.map(x => parseInt(x));
 
 // clé
 var n = parseInt($('#inp_n').val());
 var ed = parseInt($('#inp_ed').val());
 if(isNaN(n)){
  alert('valeur invalide pour n');
  return false;
 }
 if(isNaN(ed)){
  alert('valeur invalide pour e/d');
  return false;
 }
 
 
 
 var nbs_out = [];
 
 for(var i=0;i<nbs_in.length;i++){
  if(isNaN(nbs_in[i])){
   alert('séquence incorrecte ('+arr_in[i]+')');
   return false;
  }
  else{
   nbs_out.push(pow_mod(nbs_in[i],ed,n));
  }
 }
 
 $('#ta_out').val(nbs_out.join('.'));
}

function pow_mod(x,p,m){
 var r = x%m;
 for (var i=0;i<p-1;i++){
  r *= x;
  r = r%m;
 }
 return r;
}