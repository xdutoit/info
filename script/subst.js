$(function(){
	// créer tableau alphabet
	creerTableau();

	// input
	$('.inp_car').on('keyup',updateInput);

	// boutons
	$('#btn_reset').on('click', effacerTableau);
	$('#btn_random').on('click',hasardTableau);
	$('#btn_comp').on('click',completerTableau);

	$('#crypter').click(crypter);
})

function creerTableau(){
	html_str1 = '';
	html_str2 = '';
	for(var i=0;i<26;i++){
		html_str1 += '<td>'+num2car(i)+'</td>';
		html_str2 += '<td><input id="inp_car_'+i+'" class="inp_car" size="1"></td>';
	}
	$('#alpha_sub').prepend('<table><tr>'+html_str1+'</tr><tr>'+html_str2+'</tr></table>');
}

function updateInput(){
	var id = parseInt($(this).prop('id').split('_')[2]);
	var txt = $(this).val();
	if(txt.length){
		$(this).val(txt[0].toUpperCase());
		if(id<25){
			$('#inp_car_'+(id+1)).focus()
		}
	}
}

function  effacerTableau(){
	$('.inp_car').val('');
}

function hasardTableau(){
	var arr = [];
	for(var i=0;i<26;i++){
		arr.push(i);
	}
	arr.sort(() => Math.random() - 0.5);
	for(var i=0;i<26;i++){
		$('#inp_car_'+i).val(num2car(arr[i]).toUpperCase());
	}
}

function completerTableau(){
	var alpha = creerAlphabet();
	var inp_i = 0;
	var ok = true;
	while(inp_i<26 && ok){
		var curr_car = $('#inp_car_'+inp_i).val();
		if(curr_car.length){
			// enlever de alpha
			curr_car = curr_car.toUpperCase();
			var found = false;
			for(var c=0;c<alpha.length && !found;c++){
				if(alpha[c].toUpperCase()==curr_car){
					found = true;
					alpha.splice(c,1);
				}
			}
			if(!found){
				alert('erreur: '+curr_car+' apparaît plusieurs fois ou n\'est pas une lettre');
				ok = false;
			}
		}
		else{
			// compléter et enlever de alpha
			$('#inp_car_'+inp_i).val(alpha.shift().toUpperCase());
		}
		inp_i++;
	}

}

function crypter(){
	// créer tableau subst
	var subst_arr = [];
	for(var i=0;i<26;i++){
		subst_arr.push($('#inp_car_'+i).val());
	}
	// compléter clés
	$('#cle_cryp').text(subst_arr.join(''));
	var subt_arr_inv = [];
	for(var i=0;i<26;i++){
		for(var j=0;j<26;j++){
			if(car2num(subst_arr[j])==i){
				subt_arr_inv.push(num2car(j).toUpperCase());
				break;
			}
		}
	}
	$('#cle_decryp').text(subt_arr_inv.join(''));

	var txt_orig = $('#ta_in').val();
	txt_orig = nettoyerTxt(txt_orig).toLowerCase();
	$('#ta_in').val(txt_orig);

	var txt_cr = '';

	for(var t=0;t<txt_orig.length;t++){
		var curr_car = txt_orig[t].toUpperCase();

		if(curr_car==' '){
			txt_cr += ' ';
		}
		else{
			txt_cr += subst_arr[car2num(curr_car)];
		}
	}

	$('#ta_out').val(txt_cr);
}
