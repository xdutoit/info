$(function(){
	$('#crypter').click(crypter);
})

function crypter(){

	decal = parseInt($('#inp_decal').val());
	if (isNaN(decal)) {
		alert("Entrez une valeur pour le décalage");
	}
	else{
		var txt_orig = $('#ta_in').val();
		txt_orig = nettoyerTxt(txt_orig).toLowerCase();
		$('#ta_in').val(txt_orig);

		txt_cr = cesarDecal(txt_orig, decal).toUpperCase();
		$('#ta_out').val(txt_cr);
	}
}
