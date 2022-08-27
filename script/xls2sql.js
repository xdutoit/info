document.addEventListener("DOMContentLoaded", function(event) 
{
	document.querySelector('#btn_detect').addEventListener('click',parseLines);
    document.querySelector('#ta_in').addEventListener('change',parseLines);
	document.querySelector('#btn_convert').addEventListener('click',convert);
});

let lines;

const NUM = 0;
const TXT = 1;
const DATE = 2;

function parseLines(){
    // remplit le tableau lines et détecte automatiquement les types
    // remplit le tableau avec les radios
    lines = txt2array();

    let types = [];

    for(let c=0;c<n_cols;c++){
        types.push(detectType(lines[0][c]));
    }

    // remplit le tableau
    document.getElementById('tr_colnums').innerHTML = '';
    document.getElementById('tr_inputs').innerHTML = '';
    // 1ère colonne
    let tdVide = document.createElement('td');
    document.getElementById('tr_colnums').appendChild(tdVide);
    let tdTitre = document.createElement('td');
    tdTitre.appendChild(document.createTextNode('nombre'));
    tdTitre.appendChild(document.createElement('br'));
    tdTitre.appendChild(document.createTextNode('texte'));
    tdTitre.appendChild(document.createElement('br'));
    tdTitre.appendChild(document.createTextNode('date'));
    document.getElementById('tr_inputs').appendChild(tdTitre);


    // colonnes suivantes
    for(let c=0;c<n_cols;c++){
        let td1 = document.createElement('td');
        td1.appendChild(document.createTextNode((c+1)));
        let td2 = document.createElement('td');
        for(let val=0;val<3;val++){
            let radio = document.createElement('input');
            radio.setAttribute('type','radio');
            radio.setAttribute('id','radio_'+c+'_'+val);
            radio.setAttribute('name','radio_'+c);
            if(types[c]==val){
                radio.checked = 'checked';
            }
            td2.appendChild(radio);
            if(val<2){
                td2.appendChild(document.createElement('br'));
            }
        }
        document.getElementById('tr_colnums').appendChild(td1);
        document.getElementById('tr_inputs').appendChild(td2);
    }
}

function detectType(data_in){
    let data_num = parseFloat(data_in)
    if(!isNaN(data_num) && data_num+'' == data_in){
        return NUM;
    }
    if(convertDate(data_in)){
        return DATE;
    }
    return TXT;
}

function convertDate(data_in){
    // vérifie s'il s'agit bien d'une date et renvoie un string contenant la date au format SQL (AAAA-MM-JJ)
    // return false s'il ne s'agit pas d'une date
    if(data_in.indexOf('.')>=0){
        let pt1 = data_in.indexOf('.');
        if(data_in.indexOf('.',pt1+1)>=0){
            let data_arr = data_in.split('.');
            if(data_arr.length==3){
                let jour = parseInt(data_arr[0]);
                let mois = parseInt(data_arr[1]);
                let annee= parseInt(data_arr[2]);
                if(!isNaN(jour) && jour>0 && jour<32 && !isNaN(mois) && mois>0 && mois<13 && !isNaN(annee)){
                    return zeroPad(annee,4)+'-'+zeroPad(mois,2)+'-'+zeroPad(jour,2);
                }
            }
        }
    }
    return false;
}

function zeroPad(str_in, len){
    str_in = ''+str_in;
    while(str_in.length<len){
        str_in = '0'+str_in;
    }
    return str_in;
}


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

function convert(){
    // convertit le tableau lines en string SQL
    let str_out = '';
    for(let i=0;i<lines.length;i++){
        str_out += '(';

        let sep = '';
        for(let c=0;c<n_cols;c++){
            let type = -1;
            for(let val=0;val<3;val++){
                if(document.getElementById('radio_'+c+'_'+val).checked){
                    type = val;
                    break;
                }
            }



            let quote = '\'';
            if(type==NUM){
                quote = '';
            }
            let data = lines[i][c];
            if(type==DATE){
                data = convertDate(data);
            }
            str_out += sep+quote+data+quote;
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
/*
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
}*/