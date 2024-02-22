/* **************
  création de clé(s)
************** */

async function creerCles() {
    // crée une paire de clés

    document.querySelector('#taPgpClePriv').value = 'génération de clé ...';
    document.querySelector('#taPgpClePub').value = 'génération de clé ...';
    const a = await openpgp.generateKey({
        type: 'rsa', // Type of the key
        rsaBits: 2048, // RSA key size (defaults to 4096 bits)
        userIDs: [{ name: 'A A', email: 'a@a.com' }], // you can pass multiple user IDs
        passphrase: '1234' // protects the private key
    });
    document.querySelector('#taPgpClePriv').value = removeLineBreak(a['privateKey']);
    document.querySelector('#taPgpClePub').value = removeLineBreak(a['publicKey']);
}

/* **************
  chiffrement / déchiffrement
************** */

async function chiffrer() {
    // chiffre un message (sans signature)
    document.querySelector('#taPgpC1MsgChiffr').value = 'calcul ...';

    let txtClair = getValeurNonVide('#taPgpC1MsgClair', 'Veuillez écrire un message à chiffrer.');
    if(!txtClair){return;}
    let clePub = getValeurNonVide('#taPgpC1ClePub', 'Veuillez entrer une clé publique pour le chiffrement.');
    if(!clePub){return;}

    let clePub2 = await pgpCreerClePublique(clePub);
    let msgChiffre = await pgpCreerMsgChiffr(txtClair, clePub2);

    document.querySelector('#taPgpC1MsgChiffr').value = removeLineBreak(msgChiffre);
}

async function chiffrerSigner() {
    // chiffre et signe un message
    document.querySelector('#taPgpC2MsgChiffrSign').value = 'calcul ...';

    let txtClair = getValeurNonVide('#taPgpC2MsgClair', 'Veuillez écrire un message à chiffrer.');
    if(!txtClair){return;}
    let clePub = getValeurNonVide('#taPgpC2ClePub', 'Veuillez entrer une clé publique pour le chiffrement.');
    if(!clePub){return;}
    let clePriv = getValeurNonVide('#taPgpC2ClePriv', 'Veuillez entrer une clé privée pour la signature.');
    if(!clePriv){return;}

    let clePub2 = await pgpCreerClePublique(clePub);
    let clePriv2 = await pgpCreerClePrivee(clePriv);
    let msgChiffrSigne = await pgpCreerMsgChiffrSigne(txtClair, clePub2, clePriv2);

    document.querySelector('#taPgpC2MsgChiffrSign').value = removeLineBreak(msgChiffrSigne);
}

async function dechiffrer() {
    // déchiffre un message
    document.querySelector('#taPgpD1MsgClair').value = 'calcul ...';

    let txtChiffr = getValeurNonVide('#taPgpD1MsgChiffr', 'Veuillez écrire un message à déchiffrer.');
    if(!txtChiffr){return;}
    let clePriv = getValeurNonVide('#taPgpD1ClePriv', 'Veuillez entrer une clé privée pour le déchiffrement.');
    if(!clePriv){return;}

    let clePriv2 = await pgpCreerClePrivee(clePriv);
    let msgClair = await pgpCreerMsgClair(txtChiffr, clePriv2);

    document.querySelector('#taPgpD1MsgClair').value = msgClair;
}

async function dechiffrerVerifier(){
    // déchiffre et vérifie un message
    document.querySelector('#taPgpD2MsgClair').value = 'calcul ...';

    let txtChiffr = getValeurNonVide('#taPgpD2MsgChiffr', 'Veuillez écrire un message à déchiffrer.');
    if(!txtChiffr){return;}
    let clePriv = getValeurNonVide('#taPgpD2ClePriv', 'Veuillez entrer une clé privée pour le déchiffrement.');
    if(!clePriv){return;}
    let clePub = getValeurNonVide('#taPgpD2ClePub', 'Veuillez entrer une clé publique pour la vérification.');
    if(!clePub){return;}

    let clePriv2 = await pgpCreerClePrivee(clePriv);
    let clePub2 = await pgpCreerClePublique(clePub);
    let msgClair = await pgpCreerMsgClairVerifie(txtChiffr, clePriv2, clePub2);

    document.querySelector('#taPgpD2MsgClair').value = msgClair['data'];

    // vérifier signature
    let sp = document.querySelector('#pgpSignatureValide');
    try {
        await msgClair.signatures[0].verified; // throws on invalid signature
        sp.classList.remove('pgpSignatureEMPTY');
        sp.classList.remove('pgpSignatureNOK');
        sp.classList.add('pgpSignatureOK');
        sp.innerHTML = 'signature correcte';
    } catch (e) {
        sp.classList.remove('pgpSignatureEMPTY');
        sp.classList.remove('pgpSignatureOK');
        sp.classList.add('pgpSignatureNOK');
        sp.innerHTML = 'signature incorrecte ou manquante';
        console.log(e);
    }

}

function getValeurNonVide(sel, errorMsg) {
    // retourne la value de l'élément dont le sélecteur est sel, affiche errorMsg si vide
    let ret = document.querySelector(sel).value;
    if (!ret) {
        alert(errorMsg);
        return;
    }
    return ret;
}

async function pgpCreerClePublique(clePub) {
    // crée une clé publique (PGP)
    let publicKey;
    try {
        publicKey = await openpgp.readKey({
            armoredKey: clePub
        });
        return publicKey;
    }
    catch (e) {
        alert("Erreur avec la clé publique (pour plus d'informations, voir la console)");
        console.log(e);
        return;
    }
}

async function pgpCreerClePrivee(clePriv) {
    // crée et déchiffre une clé privée (PGP)
    let privateKey;
    try {
        privateKey = await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({ armoredKey: clePriv }),
            passphrase: '1234'
        });
        return privateKey;
    }
    catch (e) {
        alert("Erreur avec la clé privée (pour plus d'informations, voir la console)");
        console.log(e);
        return;
    }
}

async function pgpCreerMsgChiffr(msgClair, clePub) {
    // chiffre un message (PGP)
    let msgChiffr;
    try {
        msgChiffr = await openpgp.encrypt({
            message: await openpgp.createMessage({
                text: msgClair
            }),
            encryptionKeys: clePub
        });
        return msgChiffr;
    }
    catch (e) {
        alert("Erreur avec lors du chiffrement (pour plus d'informations, voir la console)");
        console.log(e);
        return;
    }
}

async function pgpCreerMsgClair(msgChiffr, clePriv){
    // déchiffre un message (PGP)
    let msgClair;
    try{
        msgClair = await openpgp.decrypt({
            message: await openpgp.readMessage({
                armoredMessage: msgChiffr
            }),
            decryptionKeys: clePriv
        });
        console.log(msgClair);
        return msgClair['data'];
    }
    catch(e){
        alert("Erreur avec lors du déchiffrement (pour plus d'informations, voir la console)");
        console.log(e);
        return;
    }
}

async function pgpCreerMsgChiffrSigne(txtClair, clePub, clePriv) {
    // chiffre et signe un message (PGP)
    let msgChiffr;
    try {
        msgChiffr = await openpgp.encrypt({
            message: await openpgp.createMessage({
                text: txtClair
            }),
            encryptionKeys: clePub,
            signingKeys: clePriv
        });
        return msgChiffr;
    }
    catch (e) {
        alert("Erreur avec lors du chiffrement (pour plus d'informations, voir la console)");
        console.log(e);
        return;
    }
}

async function pgpCreerMsgClairVerifie(msgChiffr, clePriv, clePub){
    // déchiffre et vérifie un message (PGP)
    let msgClair;
    try{
        msgClair = await openpgp.decrypt({
            message: await openpgp.readMessage({
                armoredMessage: msgChiffr
            }),
            decryptionKeys: clePriv,
            verificationKeys: clePub
        });
        return msgClair;

    }
    catch(e){
        alert("Erreur avec lors du déchiffrement (pour plus d'informations, voir la console)");
        console.log(e);
        return;
    }
}

/* **************
  téléchargement
************** */

function telechargerClePriv() {
    // télécharge la clé privée
    telechargerContenuDansFichier('#taPgpClePriv', 'cle_privee.txt');
}

function telechargerClePub() {
    // télécharge la clé publique
    telechargerContenuDansFichier('#taPgpClePub', 'cle_publique.txt');
}

function c1TelechargerMsg() {
    // télécharge le message chiffré
    telechargerContenuDansFichier('#taPgpC1MsgChiffr', 'message_chiffre.txt');
}

function c2TelechargerMsg() {
    //télécharge le message chiffré et signé
    telechargerContenuDansFichier('#taPgpC2MsgChiffrSign', 'message_chiffre_signe.txt');
}

function d1TelechargerMsg(){
    // télécharge le message clair
    telechargerContenuDansFichier('#taPgpD1MsgClair', 'message_clair.txt');
}

function d2TelechargerMsg(){
    // télécharge le message clair et vérifié
    telechargerContenuDansFichier('#taPgpD2MsgClair', 'message_clair_verifie.txt');
}

function telechargerContenuDansFichier(id, nomFichier) {
    // télécharge le contenu du textarea id dans un fichier nommé nomFichier
    let contenu = document.querySelector(id).value;

    let dwnel = document.createElement('a');
    dwnel.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenu));
    dwnel.setAttribute('download', nomFichier);

    dwnel.style.display = 'none';
    document.body.appendChild(dwnel);

    dwnel.click();

    document.body.removeChild(dwnel);
}

/*function getEleveInfos() {
    // récupère les infos de l'élève (classe, prénom, nom, groupe), renvoie faux si un des champs est vide
    let classe = document.querySelector('#inpPgpCleClasse').value;
    let prenom = document.querySelector('#inpPgpClePrenom').value;
    let nom = document.querySelector('#inpPgpCleNom').value;
    let groupe = document.querySelector('#inpPgpCleGroupe').value;
    if (!classe || !prenom || !nom || !groupe) {
        return false;
    }
    return classe + '_' + prenom + '_' + nom + '_' + groupe;
}*/

/* **************
  mise en forme
************** */

function removeLineBreak(txt_in){
    // enlève les sauts de ligne dans le block (garde header et footer intact)
    let txt_split = txt_in.split('\n');
    let header = txt_split.shift();
    txt_split.shift();
    txt_split.pop();
    let footer = txt_split.pop();
    return header +'\n\n' + txt_split.join('') + '\n\n' + footer;
}