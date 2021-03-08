$(function(){
  // boutons
  $('.plus').click(1,changeVal);
  $('.minus').click(-1,changeVal);
  $('.reset').click(reset);
})

var radix_list = {'dec':10,'bin':2,'hex':16};
var counter_size = 4;

/* principe de base: tout est converti en décimal, puis modifié, puis retourné dans la base d'origine */

function getBase(obj){
  // retourne 'dec', 'bin' ou 'hex'
  return $(obj).parents('.div_compteur_ext').attr('id');
}

function changeVal(e){
  // change la valeur du compteur (this) de (e.data)
  var base = getBase(this);
  var num = getDecValue(base);
  num += parseInt(e.data);
  setDecValue(num,base);

}

function getDecValue(base){
  // retourne l'équivalent décimal du compteur 'base'
  var num_str = '';
  for(var i=counter_size-1;i>=0;i--){
    num_str += $('#'+base+' .n'+i).val()
  }
  return parseInt(num_str,radix_list[base]);
}

function setDecValue(n,base){
  // donne la valeur décimale n au compteur 'base'
  if(n<0){
    n=0;
  }
  var n_str = n.toString(radix_list[base]);
  var l = n_str.length;
  for(var i=0;i<counter_size;i++){
    var v = 0;
    if(i<l){
      v = n_str[l-i-1].toUpperCase();
    }
    $('#'+base+' .n'+i).val(v);
  }
}

function reset(){
  // remet à zéro le compteur 'this'
  var base = getBase(this);
  setDecValue(0,base);
}
