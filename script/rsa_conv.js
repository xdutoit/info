$(function(){
 // listener
 $('#btn_txt2num').click(txt2num);
 $('#btn_num2txt').click(num2txt);
});

function txt2num(){
 var txt_in = $('#ta_txt').val();
 txt_in = nettoyerTxt(txt_in).toLowerCase();
	$('#ta_txt').val(txt_in);
 var nbs = [];
 var c;
 for(var i=0;i<txt_in.length;i++){
  c = txt_in.charAt(i);
  if(c==' '){
   nbs.push(0);
  }
  else{
   nbs.push(car2num(c)+1);
  }
 }
 $('#ta_nbs').val(nbs.join('.'));
}

function num2txt(){
 var nbs_in = $('#ta_nbs').val();
 var nbs_arr = nbs_in.split('.');
 var nbs_arr_val = nbs_arr.map(x => parseInt(x));
 
 // vérification
 var ok = true;
 for(var i=0;i<nbs_arr_val.length && ok;i++){
  if(isNaN(nbs_arr_val[i])){
   ok = false;
  }
 }
 if(ok){
  var txt = '';
  for(var i=0;i<nbs_arr_val.length;i++){
   if(nbs_arr_val[i]==0){
    txt += ' ';
   }
   else{
    if(nbs_arr_val[i]<=26){
     txt += num2car(nbs_arr_val[i]-1);
    }
    else{
     txt += '_';
    }
   }
  }
  $('#ta_txt').val(txt);
 }
 else{
  alert('suite de nombres invalide');
 }
 
}