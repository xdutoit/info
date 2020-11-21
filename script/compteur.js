$(function(){
  // button event listeners
  $('.plus').click(1,changeVal);
  $('.minus').click(-1,changeVal);
  $('.reset').click(reset);
})

radix_list = {'dec':10,'bin':2,'hex':16}

function getBase(obj){
  return $(obj).parents('.div_compteur_ext').attr('id')
}

function changeVal(e){
  var base = getBase(this);
  var num = getDecValue(base);
  num += parseInt(e.data);
  setDecValue(num,base);

}

function getDecValue(base){
  var num_str = '';
  for(var i=3;i>=0;i--){
    num_str += $('#'+base+' .n'+i).val()
  }
  return parseInt(num_str,radix_list[base]);
}

function setDecValue(n,base){
  if(n<0){
    n=0;
  }
  n_str = n.toString(radix_list[base]);
  l = n_str.length
  for(var i=0;i<4;i++){
    v = 0
    if(i<l){
      v = n_str[l-i-1].toUpperCase()
    }
    $('#'+base+' .n'+i).val(v);
  }
}


function reset(){
  var base = getBase(this);
  setDecValue(0,base);
}

/*
parseInt('101',2) -> 5 bin2dec

dec2bin:

(54).toString(2)*/
