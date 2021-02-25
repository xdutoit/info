$(function(){
 var primes = [];
 for(var i=2;i<=999;i++){
  if(isPrime(i)){
   primes.push(i);
  }
 }
 $('#sp_primes').text(primes.join(' '));
});

function isPrime(n){
 if(i<2){
  return false;
 }
 var s = Math.sqrt(n);
 for(var i=2;i<s;i++){
  if(n%i==0){
   return false;
  }
 }
 return true;
}