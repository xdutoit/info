function nettoyerTxt(txt_in){
	txt_in = txt_in.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	txt_out = '';
	for(var l=0;l<txt_in.length;l++){
		var n_in = txt_in.charCodeAt(l);
		var n_out = -1;
		if(n_in>=97 && n_in<=122){
			n_out = n_in;
		}
		else if (n_in>=65 && n_in<=90) {
			n_out = n_in;
		}
		if(n_out>0){
			txt_out += String.fromCharCode(n_out);
		}
		else{
			txt_out += ' ';
		}
	}
	return txt_out;
}

function car2num(c){
	return c.toUpperCase().charCodeAt(0)-65;
}

function num2car(n){
	return String.fromCharCode(n+97);
}

function cesarDecal(txt_in, decal){

	var txt_cr = '';

	for(var c=0;c<txt_in.length;c++){
		var car = txt_in[c];
		if(car==' '){
			txt_cr += ' ';
		}
		else{
			txt_cr += num2car((car2num(car)+decal+26)%26);
		}
	}

	return txt_cr;
}

var freq_ref = [
0.085,
0.013,
0.037,
0.042,
0.164,
0.013,
0.014,
0.013,
0.075,
0.004,
0.003,
0.056,
0.03,
0.072,
0.057,
0.028,
0.007,
0.069,
0.074,
0.067,
0.051,
0.013,
0.002,
0.004,
0.005,
0.002
];

function creerAlphabet(){
	var tab = [];
	for(var i=0;i<26;i++){
		tab.push(num2car(i));
	}
	return tab;
}

function normaliserMax(arr_in){
	var max_val = -1;
	for(var i=0;i<arr_in.length;i++){
		if(arr_in[i]>max_val){
			max_val	= arr_in[i];
		}
	}

	for(var i=0;i<arr_in.length;i++){
		arr_in[i] /= max_val;
	}
}
