$(function(){
 // bouton
 $('#latex').click(gen_latex);
});

function gen_latex(){
 html_str = '';
 for(var i=0;i<9;i++){
  sep = '';
  for(var j=0;j<9;j++){
   html_str += sep + $('.lin_'+i+'.col_'+j).val();
   sep = '&';
  }
  html_str += '\\\\<br>\\hline<br>';
 }
 $('#latex_out').html(html_str);
 console.log(html_str);
}