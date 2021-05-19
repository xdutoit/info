$(function () {
  // listener
  if ($('#btn_decryp')) {
    $('#btn_decryp').click(decryp);
  }
  if ($('#btn_cryp')) {
    $('#btn_cryp').click(cryp);
  }
});


function decryp() {
  // séquence à décrypter
  let txt_in = $('#ta_cryp').val();
  let arr_in = txt_in.split('.');
  let nbs_in = arr_in.map(x => parseInt(x));

  // clé
  let n = parseInt($('#inp_n').val());
  let ed = parseInt($('#inp_ed').val());
  if (isNaN(n)) {
    alert('valeur invalide pour n');
    return false;
  }
  if (isNaN(ed)) {
    alert('valeur invalide pour e/d');
    return false;
  }

  // séquence claire
  let nbs_out = [];
  for (let i = 0; i < nbs_in.length; i++) {
    if (isNaN(nbs_in[i])) {
      alert('séquence incorrecte (' + arr_in[i] + ')');
      return false;
    }
    else {
      nbs_out.push(pow_mod(nbs_in[i], ed, n));
    }
  }

  // texte clair
  let txt = num2txt(nbs_out);
  $('#ta_clair').val(txt);
/*
  let txt = '';
  for (let i = 0; i < nbs_out.length; i++) {
    if (nbs_out[i] == 0) {
      txt += ' ';
    }
    else {
      if (nbs_out[i] <= 26) {
        txt += num2car(nbs_out[i] - 1);
      }
      else {
        txt += '_';
      }
    }
  }
  $('#ta_clair').val(txt);
  */
}

function cryp() {
  // séquence à crypter
  let txt_in = $('#ta_clair').val();
  let seq_clair = txt2num(txt_in);

  // clé
 var n = parseInt($('#inp_n').val());
 var ed = parseInt($('#inp_ed').val());
 if(isNaN(n)){
  alert('valeur invalide pour n');
  return false;
 }
 if(isNaN(ed)){
  alert('valeur invalide pour e/d');
  return false;
 }

 // séquence cryptée
  let nbs_out = [];
  for (let i = 0; i < seq_clair.length; i++) {
    nbs_out.push(pow_mod(seq_clair[i], ed, n));
  }
  $('#ta_cryp').val(nbs_out.join('.'));




}

function txt2num(txt_in) {
  txt_in = nettoyerTxt(txt_in).toLowerCase();
  $('#ta_txt').val(txt_in);
  let nbs = [];
  let c;
  for (let i = 0; i < txt_in.length; i++) {
    c = txt_in.charAt(i);
    if (c == ' ') {
      nbs.push(0);
    }
    else {
      nbs.push(car2num(c) + 1);
    }
  }
  return nbs;
}



function num2txt(nbs_arr_val) {
  // vérification
  let ok = true;
  for (let i = 0; i < nbs_arr_val.length && ok; i++) {
    if (isNaN(nbs_arr_val[i])) {
      ok = false;
    }
  }
  if (ok) {
    let txt = '';
    for (let i = 0; i < nbs_arr_val.length; i++) {
      if (nbs_arr_val[i] == 0) {
        txt += ' ';
      }
      else {
        if (nbs_arr_val[i] <= 26) {
          txt += num2car(nbs_arr_val[i] - 1);
        }
        else {
          txt += '_';
        }
      }
    }
    return txt;
  }
  else {
    alert('suite de nombres invalide');
  }

}



function pow_mod(x, p, m) {
  let r = x % m;
  for (let i = 0; i < p - 1; i++) {
    r *= x;
    r = r % m;
  }
  return r;
}
