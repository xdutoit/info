// no jQuery
document.addEventListener("DOMContentLoaded", function(event) 
{
	document.querySelector('#btn_convert').addEventListener('click',convert);
})

function convert(){
    let txt_in = document.querySelector('#ta_in').value;
    
    // split \n
    let lines_0 = txt_in.split('\n');

    // trim and split \t
    let lines = []
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
    let n_cols = lines[0].length;
    for(let i=1;i<lines.length;i++){
        if(lines[i].length != n_cols){
            alert('Le nombres de colonnes n\'est pas cohérents.\n(certaines lignes ont '+n_cols+' colonnes et d\'autres en ont '+lines[i].length+').');
            return;
        }
    }

    // check types
    let types = [];
    for(let c=0;c<n_cols;c++){
        let t=1; // 0=txt / 1=num
        for(let i=0;i<lines.length;i++){
            if(!strIsNum(lines[i][c])){
                t=0;
            }
        }
        types.push(t);
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
            str_out += ',\n'
        }
    }
    document.querySelector('#ta_out').value = str_out;
}

function strIsNum(str_in){
    if(isNaN(parseFloat(str_in))){
        console.log(str_in + 'not num')
        return false;
    }
    else{
        return true;
        // TODO
        // date ?
        

    }
}