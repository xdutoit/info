$(function(){
 // liste nbs premiers
 afficherListePrems();
 
 // listener
 $('#btn_gen_cle').click(genererCle);
});

function afficherListePrems(){
 var primes = [];
 for(var i=2;i<=999;i++){
  if(isPrime(i)){
   primes.push(i);
  }
 }
 $('#sp_primes').text(primes.join(' '));
}

function genererCle(){
 var p = parseInt($('#inp_p').val());
 var q = parseInt($('#inp_q').val());
 
 if (isPrime(p) && isPrime(q) ){
  var n = p*q;
  var phi = (p-1)*(q-1);
  
  // recherche de e
  var e = 2;
  var found = false;
  while (!found){
   if( isPrime(e) && (phi%e!=0) ){
    found = true;
    e--;
   }
   e++;
   if(e>1000){
    alert('problème avec la génération de e');
    e='';d ='';p='';q='';n='';phi='';
    break;
   }
  }
  
  // recherche de d
  var d = e+1;
  found = false;
  while (!found) {
   var m = e*d;
   if(m%phi == 1){
    found = true;
    d--;
   }
   d++;
   if(d>1000){
    alert('problème avec la génération de d');
    e='';d ='';p='';q='';n='';phi='';
    break;
   }
  }
  
  
  // afficher résultats
  $('#sp_p').text(p);
  $('#sp_q').text(q);
  $('#sp_n').text(n);
  $('#sp_phi').text(phi);
  $('#sp_e').text(e);
  $('#sp_d').text(d);
  
  $('#sp_clePriv').text('('+n+','+d+')');
  $('#sp_clePub').text('('+n+','+e+')');



 }
 else{
  if (!isPrime(p)){
   alert('p n\'est pas premier');
  }
  if (!isPrime(q)){
   alert('q n\'est pas premier');
  }
 }
}

function isPrime(n){
 if(i<2){
  return false;
 }
 var s = Math.sqrt(n);
 for(var i=2;i<=s;i++){
  if(n%i==0){
   return false;
  }
 }
 return true;
}