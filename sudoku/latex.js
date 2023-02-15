function gen_latex(){
    let html_str = '';
    for(let i=0;i<9;i++){
        let sep = '';
        for(let j=0;j<9;j++){
            html_str += sep + document.querySelector('.lin_'+i+'.col_'+j).value;
            sep = '&';
        }
        html_str += '\\\\<br>\\hline<br>';
    }
    document.querySelector('#latex_out').innerHTML = html_str;
    console.log(html_str);
}