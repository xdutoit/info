// no jQuery
document.addEventListener("DOMContentLoaded", function(event) 
{
	document.querySelector('#btn_convert_auto').addEventListener('click',convert_autodetect);
	document.querySelector('#btn_convert_man').addEventListener('click',convert_manual);
    document.querySelector('#ta_in').addEventListener('change',update_cols);
});

function txt2array(){
    let txt_in = document.querySelector('#ta_in').value;

    // split \n
    let lines_0 = txt_in.split('\n');

    // trim and split \t
    lines = []
    for(let i=0;i<lines_0.length;i++){
        let l = lines_0[i].split('\t');
        let found = false;
        for(let k=0;k<l.length;k++){
            l[k] = l[k].trim();
            if(l[k].length){
                found = true;
            }
        }
        if(found){
            lines.push(l);
        }
    }

    // check number of columns
    n_cols = lines[0].length;
    for(let i=1;i<lines.length;i++){
        if(lines[i].length != n_cols){
            alert('Le nombres de colonnes n\'est pas cohérents.\n(certaines lignes ont '+n_cols+' colonnes et d\'autres en ont '+lines[i].length+').');
            return;
        }
    }

    return lines;
}

function update_cols(types){
    // crée le tableau avec les checkboxes pour choisir si une colonne est numérique ou non
    // si types est passé en paramètre, les checkboxes sont pré-remplis

    document.getElementById('tr_colnums').innerHTML = '';
    document.getElementById('tr_inputs').innerHTML = '';

    types = types || [];
    let lines = txt2array();
    let n_cols = lines[0].length;

    for(let c=0;c<n_cols;c++){
        let chk = document.createElement('input');
        chk.setAttribute('id','chk_'+c);
        chk.setAttribute('value',1);
        chk.setAttribute('type','checkbox');
        if(c<types.length && types[c]){
            chk.checked = 'checked';
        }
        let td1 = document.createElement('td');
        td1.appendChild(document.createTextNode((c+1)));
        let td2 = document.createElement('td');
        td2.appendChild(chk);

        document.getElementById('tr_colnums').appendChild(td1);
        document.getElementById('tr_inputs').appendChild(td2);
    }
}

function convert_manual(){
    convert(false);
}

function convert_autodetect(){
    convert(true);
}

function convert(auto){
    let lines = txt2array();
    let n_cols = lines[0].length;

    // check types
    let types = [];
    if(auto){
        // auto-detect types
        for(let c=0;c<n_cols;c++){
            let t=1; // 0=txt / 1=num
            for(let i=0;i<lines.length;i++){
                if(!strIsNum(lines[i][c])){
                    t=0;
                }
            }
            types.push(t);
        }
        update_cols(types);
    }
    else{
        for(let c=0;c<n_cols;c++){
            types.push(document.getElementById('chk_'+c).checked?1:0);
        }
    }
    
    
    // output
    let str_out = '';
    for(let i=0;i<lines.length;i++){
        str_out += '(';

        let sep = '';
        for(let c=0;c<n_cols;c++){
            let quote = '\'';
            if(types[c]){
                quote = '';
            }
            str_out += sep+quote+lines[i][c]+quote;
            sep = ', ';
        }
        str_out += ')';
        if(i<lines.length-1){
            str_out += ',\n';
        }
        else{
            str_out += ';';
        }
    }
    document.querySelector('#ta_out').value = str_out;
}

function strIsNum(str_in){
    if(isNaN(parseFloat(str_in))){
        return false;
    }
    else{
        return true;
    }
}