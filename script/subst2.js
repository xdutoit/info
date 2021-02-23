var ctx_ref;
var ctx_txt;
var cnv_H = 130; // dims canvas
var cnv_W = 600;
var txt_H = 30; // hauteur de la zone de texte
var bar_H = cnv_H-txt_H; // hauteur max d'une barre
var bar_W= Math.floor(cnv_W/26)-2; // largeur d'une barre (histogramme)
var bar_SP = Math.floor(cnv_W-26*bar_W)/25; // espace entre deux barres

var alphabet = [];

var freq_txt = [];

$(function(){
	//canvas
	ctx_ref = $('#cnv_stats_ref')[0].getContext('2d');
	ctx_ref.font = 'bold 14px Arial';
	ctx_ref.textAlign = 'center'

	ctx_txt = $('#cnv_stats_txt')[0].getContext('2d');
	ctx_txt.font = 'bold 14px Arial';
	ctx_txt.textAlign = 'center'

	// dessiner alphabet
	for(var i=0;i<26;i++){
		ctx_txt.fillText(num2car(i).toUpperCase(), bar_W/2+i*(bar_W+bar_SP), cnv_H-10);
		ctx_ref.fillText(num2car(i), bar_W/2+i*(bar_W+bar_SP), cnv_H-10);
	}

	// créer tableau alphabet
	normaliserMax(freq_ref);
	creerTableau();
	alphabet = creerAlphabet();
	dessinerStatsRef();

	// input
	$('.inp_car').on('keyup',updateInput);

	// listeners
	$('#ta_in').on('keyup',calculerStats);
	$('#ta_in').on('change',calculerStats);

	// boutons
	$('#btn_reset').on('click',effacerTableau);
	$('#btn_decrypt').on('click',decrypter);
})

function creerTableau(){
	html_str1 = '';
	html_str2 = '';
	for(var i=0;i<26;i++){
		html_str1 += '<td>'+num2car(i).toUpperCase()+'</td>';
		html_str2 += '<td><input id="inp_car_'+i+'" class="inp_car" size="1"></td>';
	}
	$('#alpha_sub').prepend('<table><tr>'+html_str1+'</tr><tr>'+html_str2+'</tr></table>');
}

function effacerTableau(){
	$('.inp_car').val('');
	dessinerStatsTxt();
}

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
			for(var c2=0;c2<26;c2++){
				if(car.toUpperCase()==alphabet[c2].toUpperCase()){
					freq_txt[c2]++;
				}
			}
		}

		normaliserMax(freq_txt)

		dessinerStatsTxt()
		console.log(freq_txt)

		calcul_en_cours = false;
	}
}

function dessinerStatsTxt(){
	// effacer
	ctx_txt.fillStyle = '#FFFFFF';
	ctx_txt.fillRect(0,0,cnv_W,bar_H);

	// stats txt
	ctx_txt.fillStyle = '#FF000033';
	for(var i=0;i<26;i++){
		var h = freq_txt[i]*bar_H;
		ctx_txt.fillRect(i*(bar_W+bar_SP),bar_H-h,bar_W,h);
	}

	// stats ref
	ctx_txt.fillStyle = '#0000FF33';
	for(var i=0;i<26;i++){
		var c = $('#inp_car_'+i).val();
		if(c != ''){
			var h = freq_ref[car2num(c)]*bar_H;
			ctx_txt.fillRect(i*(bar_W+bar_SP),bar_H-h,bar_W,h);
		}
	}

}

function dessinerStatsRef(){
	ctx_ref.fillStyle = '#0000FF33';
	for(var i=0;i<26;i++){
		var h = freq_ref[i]*bar_H;
		ctx_ref.fillRect(i*(bar_W+bar_SP),bar_H-h,bar_W,h);
	}
}

function decrypter(){
	var txt_in = $('#ta_in').val();

	var html_out = ''

	for (var c=0;c<txt_in.length;c++){
		var car = txt_in[c].toLowerCase();
		if(car == ' '){
			html_out += ' ';
		}
		else if ($('#inp_car_'+car2num(car)).val()) {
			html_out += '<span class="fond_clair">'+$('#inp_car_'+car2num(car)).val().toLowerCase()+'</span>';
		}
		else{
			html_out += '<span class="fond_crypte">'+car.toUpperCase()+'</span>';
		}
	}

	$('#div_out').html(html_out);

}

function updateInput(){
	dessinerStatsTxt();
	var txt_out = '';
	for(var c=0;c<26;c++){
		var found = false;
		for(var i=0;i<26 && !found;i++){
			if($('#inp_car_'+i).val()==num2car(c)){
				found=true;
			}
		}
		if(!found){
			txt_out += num2car(c);
		}
	}
	$('#span_lettres_vides').text(txt_out);
}
