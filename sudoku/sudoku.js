window.onload = function(){
    // créer tableau
    let tab = document.querySelector('#sud_table');
    // ligne de titre (lettres)
    let row0 = document.createElement('tr');
    let row_ctn = '<th></th>';
    for(let i=0;i<9;i++){
        row_ctn += '<th>'+String.fromCharCode(65+i)+'</th>';
    }
    row0.innerHTML = row_ctn;
    tab.appendChild(row0);
    // ligne suivantes
    for(let r=0;r<9;r++){
        let rowr = document.createElement('tr');
        rowr.classList.add('tr_'+r);
        let rowr_ctn = '<th>'+(r+1)+'</th>';
        for(let c=0;c<9;c++){
            let blk = Math.floor(r/3)*3+Math.floor(c/3); // id du bloc
            let tdcls = '';
            if(blk%2){
                tdcls=' tdgr';
            }
            rowr_ctn += '<td class="td_'+r+'_'+c+tdcls+'">'
            rowr_ctn += '<input class="lin_'+r+' col_'+c+' blk_'+blk+'" />';
            rowr_ctn += '</td>';
        }
        rowr.innerHTML = rowr_ctn;
        tab.appendChild(rowr);
    }

    // boutons
    document.querySelector('#solve').addEventListener('click',solve);
    document.querySelector('#reset').addEventListener('click',resetTable);
    document.querySelector('#exemple').addEventListener('click',exempleTable);
};

function resetTable(){
    // efface tous les inputs
    document.querySelectorAll('input').forEach(function(e){e.value='';});
}

function exempleTable(){
    // pré-remplit avec un exemple de sudoku difficile
    resetTable();

    document.querySelector('.lin_0.col_0').value = 5;
    document.querySelector('.lin_0.col_1').value = 3;
    document.querySelector('.lin_0.col_4').value = 7;
    document.querySelector('.lin_1.col_0').value = 6;
    document.querySelector('.lin_1.col_3').value = 1;
    document.querySelector('.lin_1.col_4').value = 9;
    document.querySelector('.lin_1.col_5').value = 5;
    document.querySelector('.lin_2.col_1').value = 9;
    document.querySelector('.lin_2.col_2').value = 8;
    document.querySelector('.lin_2.col_7').value = 6;

    document.querySelector('.lin_3.col_0').value = 8;
    document.querySelector('.lin_3.col_4').value = 6;
    document.querySelector('.lin_3.col_8').value = 3;
    document.querySelector('.lin_4.col_0').value = 4;
    document.querySelector('.lin_4.col_3').value = 8;
    document.querySelector('.lin_4.col_5').value = 3;
    document.querySelector('.lin_4.col_8').value = 1;
    document.querySelector('.lin_5.col_0').value = 7;
    document.querySelector('.lin_5.col_4').value = 2;
    document.querySelector('.lin_5.col_8').value = 6;
    
    document.querySelector('.lin_6.col_1').value = 6;
    document.querySelector('.lin_6.col_6').value = 2;
    document.querySelector('.lin_6.col_7').value = 8;
    document.querySelector('.lin_7.col_3').value = 4;
    document.querySelector('.lin_7.col_4').value = 1;
    document.querySelector('.lin_7.col_5').value = 9;
    document.querySelector('.lin_7.col_8').value = 5;
    document.querySelector('.lin_8.col_4').value = 8;
    document.querySelector('.lin_8.col_7').value = 7;
    document.querySelector('.lin_8.col_8').value = 9;
}

function solve(){
    document.querySelectorAll('input').forEach(function(e){e.classList.remove('newSol')});
    
    // calculer aleurs potentielles
    updateSolved();
    addDataAttr();

    document.querySelector('#txt_out').innerHTML += '--------------------------------<br>';
    
    // compléter dernière valeurs possibles
    for(let c=0;c<9;c++){
		for(let r=0;r<9;r++){
            let inp = document.querySelector('.lin_'+r+'.col_'+c)
            if(inp.classList.contains('unsolved')){
                let pot_str = inp.getAttribute('data-pot');
                let pot = -1;
			    let numPot = 0;
			    for(let i=0;i<9;i++){
			 	    if(pot_str.charAt(i)=='0'){
			 		    pot=i+1;
			 		    numPot++;
			 	    }
			    }
                if(numPot==1){
                    document.querySelector('#txt_out').innerHTML += getColumnLetter(c+1)+(r+1)+" : "+pot+" (toutes les autres valeurs sont impossibles ici)<br>";
                    inp.value = pot;
                    inp.classList.add('newSol');
                }
            }
        }
    }

    // compléter seule valeur possible
    let sel = ['.lin_','.col_','.blk_'];
    let sel2 = ['cette ligne','cette colonne','ce bloc'];
    for(let t=0;t<3;t++){
        for(let x=0;x<9;x++){
            let cls = sel[t]+x+'.unsolved';
            let elems = document.querySelectorAll(cls);
            let str_arr = [];
            for(let i=0;i<elems.length;i++){
                str_arr[i] = elems[i].getAttribute('data-pot');
            }
            for(let n=0;n<9;n++){
                let numPot = 0;
                let pot = -1;
                for(let s=0;s<elems.length;s++){
                    if(str_arr[s].charAt(n)=='0'){
                        pot = s;
                        numPot++;
                    }
                }
                if(numPot==1){
                    let coords = getCoords(elems[pot]);
                    document.querySelector('#txt_out').innerHTML += getColumnLetter(coords[0]+1)+(coords[1]+1)+" : "+(n+1)+" (seul endroit où mettre un "+(n+1)+" dans "+sel2[t]+")<br>";
                    elems[pot].value = n+1;
                    elems[pot].classList.add('newSol');
                }
            }
        }
    }
 
    if(!document.querySelectorAll('.newSol').length){
        updateSolved();
        if(!document.querySelectorAll('.unsolved').length){
            alert('FINI');
        }
        else{
            alert('Bloqué :(');
        }
    }
}

function updateSolved(){
    for(let r=0;r<9;r++){
		for(let l=0;l<9;l++){
            let inp = document.querySelector('.lin_'+l+'.col_'+r)
            if(inp.value){
                inp.classList.remove('unsolved');
            }
            else{
                inp.classList.add('unsolved');
            }
        }
    }
}

function addDataAttr(){
    for(let c=0;c<9;c++){
		for(let r=0;r<9;r++){
            if(document.querySelector('.lin_'+r+'.col_'+c).classList.contains('unsolved')){
                document.querySelector('.lin_'+r+'.col_'+c).setAttribute('data-pot',getInputPotentials(r,c));

            }
        }
    }
}

function getInputPotentials(r,c){
    // retourne un string avec des 0 et 1: les 0 sont les possibilités
    let b = Math.floor(r/3)*3+Math.floor(c/3);
    return combine(getClassStatus('lin_'+r),getClassStatus('col_'+c),getClassStatus('blk_'+b))
}

function getClassStatus(cls){
    // retourne un string de 0 et 1: les 1 sont les nbs déjà présents	
    let vals = '000000000'.split('');
    let v;

    document.querySelectorAll('.'+cls).forEach(function(e){
        v=e.value;
        if(v=e.value){
            vals[v-1] = '1';
        }
    });
    
    return vals.join('');
}

function combine(str1, str2, str3){
    let strC = '111111111'.split('');
    for(let i=0;i<9;i++){
        if(str1.charAt(i)=='0' && str2.charAt(i)=='0' && str3.charAt(i)=='0'){
            strC[i]='0';
        }
    }
    return strC.join('');
}

function getColumnLetter(c){
    let ret = 'ABCDEFGHI'.split('');
    return ret[c-1];
}

function getCoords(e){
    // renvoie les coordonnées de l'input e
    // retour = [colonne, ligne]

    let clist = e.classList.value.split(" ");
    
    let lin = -1;
    let col = -1;
    for(let ci=0;ci<clist.length;ci++){
        c = clist[ci];
        if (c.includes("lin_")){
            lin = parseInt(c.substring(4));
        }
        if (c.includes("col_")){
            col = parseInt(c.substring(4));
        }
    }
    return [col, lin];
}