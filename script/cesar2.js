// vars dessins stats
var ctx;
var cnv_H = 230; // dims canvas
var cnv_W = 600;
var txt_H = 30; // hauteur de la zone de texte
var bar_H = cnv_H-txt_H; // hauteur max d'une barre
var bar_W= Math.floor(cnv_W/26)-2; // largeur d'une barre (histogramme)
var bar_SP = Math.floor(cnv_W-26*bar_W)/25; // espace entre deux barres

var alphabet = [];

var freq_txt = [];


$(function(){
	ctx = $('#cnv_stats')[0].getContext('2d');

	ctx.font = 'bold 14px Arial';
	ctx.textAlign = 'center'

	// dessiner alphabet
	for(var i=0;i<26;i++){
	  ctx.fillText(num2car(i), bar_W/2+i*(bar_W+bar_SP), cnv_H-10);
	}

	// init alphabet
	for(var i=0;i<26;i++){
		alphabet.push(num2car(i))
	}

	// init freq_txt
	for(var i=0;i<26;i++){
		freq_txt.push(0)
	}

	// normalize freq_ref
	normaliserMax(freq_ref);


	// event listener
	$('#ta_in').on('keyup',calculerStats);
	$('#ta_in').on('change',calculerStats);
	$('#inp_decal').on('change',decaler);
	$('#inp_decal').on('mousemove',decaler);
	$('#btn_decrypter').on('click',decrypter);

	decaler();
});

function resetFreqs(){
	for(var i=0;i<26;i++){
		freq_txt[i]=0;
	}
}

var calcul_en_cours = false;
function calculerStats(){
	if(!calcul_en_cours){
		calcul_en_cours = true;
		var txt_i = nettoyerTxt($('#ta_in').val()).toUpperCase();
		$('#ta_in').val(txt_i);

		resetFreqs();
		for(var c=0;c<txt_i.length;c++){
			var car = txt_i[c];
			if (car != ' '){
				for(var c2=0;c2<26;c2++){
					if(car.toUpperCase()==alphabet[c2].toUpperCase()){
						freq_txt[c2]++;
					}
				}

			}
		}

		normaliserMax(freq_txt)

		dessinerStats()
		console.log(freq_txt)

		calcul_en_cours = false;
	}
}

function dessinerStats(){
	// effacer
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0,0,cnv_W,bar_H);

	// stats txt
	ctx.fillStyle = '#FF000033';
	for(var i=0;i<26;i++){
		var h = freq_txt[i]*bar_H;
		ctx.fillRect(i*(bar_W+bar_SP),bar_H-h,bar_W,h);
	}

	// stats gen
	ctx.fillStyle = '#0000FF33';
	for(var i=0;i<26;i++){
		var h = freq_ref[(26+i-decal)%26]*bar_H;
		ctx.fillRect(i*(bar_W+bar_SP),bar_H-h,bar_W,h);
	}
}

var decal = 0;

function decaler(){
	decal = parseInt($('#inp_decal').val());
	$('#sp_decal').text(decal);

	dessinerStats();


}

function decrypter(){
	var txt_i = nettoyerTxt($('#ta_in').val());
	$('#ta_in').val(txt_i);

	var txt_out = cesarDecal(txt_i,-decal);

	$('#ta_out').val(txt_out);
}
