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
var freq_ref = getFreqRefNorm();

var txt_stats = [];
var ref_stats = [];

$(function(){
	//canvas
	ctx_ref = $('#cnv_stats_ref')[0].getContext('2d');
	ctx_ref.font = 'bold 14px Arial';
	ctx_ref.textAlign = 'center'

	ctx_txt = $('#cnv_stats_txt')[0].getContext('2d');
	ctx_txt.font = 'bold 14px Arial';
	ctx_txt.textAlign = 'center'

	// créer liste référence
	for(var i=0;i<26;i++){
		ref_stats[i] = {'car':num2car(i), 'n':getFreqRef(i)};
	}
	ref_stats.sort(decFreq);

	// créer stats vides
	for(var i=0;i<26;i++){
		txt_stats[i] = {'car':num2car(i),'n':0};
	}


	// dessiner alphabet ref
	for(var i=0;i<26;i++){
		ctx_ref.fillText(ref_stats[i]['car'], bar_W/2+i*(bar_W+bar_SP), cnv_H-10);
	}

	// créer tableau alphabet
	creerTableau();
	alphabet = creerAlphabet();
	dessinerStatsRef();
	updateInput();

	// input
	$('.inp_car').on('keyup',updateInput);

	// listeners
	$('#ta_in').on('keyup',calculerStats);
	$('#ta_in').on('change',calculerStats);

	// boutons
	$('#btn_reset').on('click',effacerTableau);
	$('#btn_decrypt').on('click',decrypter);
})

function decFreq(a,b){
	return b['n']-a['n'];
}

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
	updateInput();
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
			freq_txt[car2num(txt_i[c])]++;
		}

		normaliserMax(freq_txt);

		for(var i=0;i<26;i++){
			txt_stats[i] = {'car':num2car(i),'n':freq_txt[i]};
		}
		txt_stats.sort(decFreq);

		dessinerStatsTxt();

		calcul_en_cours = false;
	}
}

function dessinerStatsTxt(){
	// effacer
	ctx_txt.fillStyle = '#FFFFFF';
	ctx_txt.fillRect(0,0,cnv_W,cnv_H);

	// alphabet
	ctx_txt.fillStyle = '#000000';
	for(var i=0;i<26;i++){
		console.log('dessine '+txt_stats[i]['car'].toUpperCase())
		ctx_txt.fillText(txt_stats[i]['car'].toUpperCase(), bar_W/2+i*(bar_W+bar_SP), cnv_H-10);
	}

	// stats txt
	ctx_txt.fillStyle = '#FF000033';
	for(var i=0;i<26;i++){
		var h = txt_stats[i]['n']*bar_H;
		ctx_txt.fillRect(i*(bar_W+bar_SP),bar_H-h,bar_W,h);
	}

	// stats ref
	ctx_txt.fillStyle = '#0000FF33';
	for(var i=0;i<26;i++){
		var c = $('#inp_car_'+car2num(txt_stats[i]['car'])).val();
		if(c != ''){
			var h = freq_ref[car2num(c)]*bar_H;
			ctx_txt.fillRect(i*(bar_W+bar_SP),bar_H-h,bar_W,h);
		}
	}

}

function dessinerStatsRef(){

	ctx_ref.fillStyle = '#FFFFFF';
	ctx_ref.fillRect(0,0,cnv_W,bar_H);


	var empty_letters = getUnassignedLetters();
	for(var i=0;i<26;i++){
		ctx_ref.fillStyle = '#0000FF33';
		if(empty_letters.indexOf(ref_stats[i]['car'])<0){
			ctx_ref.fillStyle = '#0000FF11';
		}
		var h = ref_stats[i]['n']*bar_H;
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
	dessinerStatsRef();
	$('#span_lettres_vides').text(getUnassignedLetters());
}

function getUnassignedLetters(){
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
	return txt_out;
}
