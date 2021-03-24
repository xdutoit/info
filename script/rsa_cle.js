$(function(){
	// liste nbs premiers
	//afficherListePrems();

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
	var n = p*q;

	if (isPrime(p) && isPrime(q) && n>26){

		var phi = (p-1)*(q-1);
		console.log('n: '+n);
		console.log('phi: '+phi);

		// recherche de e
		var e = -1;
		var e_force = parseInt(document.querySelector('#inp_e').value);
		if(e_force){
			console.log('essai avec e forcé à '+e_force);
			if( isPrime(e_force) && (phi%e_force!=0) ){
				e = e_force;
			}
			else{
				if(!isPrime(e_force)){
					alert('Problème avec le e fourni: '+e_force+' n\'est pas premier.');
				}
				if(phi%e_force==0){
					alert('Problème avec le e fourni: '+e_force+' est un diviseur de '+phi+'.');
				}
			}
		}
		if(e<0){

			var candidats = [];
			for(var c=2;c<phi;c++){
				if( isPrime(c) && (phi%c!=0) ){
					candidats.push(c);
				}
			}
			console.log(candidats);
			if(candidats.length==0){
				alert('Problème avec la génération de e');
				e='';d ='';p='';q='';n='';phi='';
			}
			var pick = Math.floor(Math.random()*candidats.length);
			var e = candidats[pick];
			console.log('e: '+e);
		}


		// recherche de d
		// (algo euclide étendu)
		var r = e;
		var old_r = phi;
		var s = 1;
		var old_s = 0;
		var nb_etapes = 0;
		var quot = -1;
		while(r!=1 && nb_etapes<1000){
			r_swap = r;
			s_swap = s;

			quot = Math.floor(old_r/r);
			r = old_r - quot*r;
			old_r = r_swap;

			s = old_s - quot*s;
			old_s = s_swap;

			console.log(r+' '+old_r+' '+s+' '+old_s+' '+quot);

			nb_etapes++;
		}
		console.log('étapes: '+nb_etapes);
		if(s<0){
			s += phi;
		}
		d = s;

		if(d==e){
			d += phi;
			console.log('d+=phi')
			//alert('Problème: clé inutilisable car e=d\nGénérez une nouvelle clé.');
		}

		/*
		var d = e+1;
		var nb_essais_d = 0;
		found = false;
		while (!found) {
		var m = e*d;
		if(m%phi == 1){
		found = true;
		d--;
	}
	nb_essais_d++;
	d++;
	if(nb_essais_d>1000){
	alert('problème avec la génération de d');
	e='';d ='';p='';q='';n='';phi='';
	break;
}
}
console.log('nb_essais_d: '+nb_essais_d);*/



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
	if (n<=26){
		alert('n n\'est pas assez grand (on doit avoir n>26)');

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
