const { fstat } = require('fs');
const http=require('http');
const url=require('url');
const fs=require('fs').promises;


const host='localhost';
const port=8080;


let theFile;
let filesType={
    'txt':'plain',
    'html':'text/html',
    'js':'text/js',
    'jpeg':'img/jpeg',
    'jpg':'img/jpg',
    'png':'img/png'
};


const requestListener=(req,res)=>{
    let uri = url.parse(req.url,true);
    let filename = "." + uri.pathname;
    let extension=filename.split('.').pop().split(/\#|\?/)[0];

    filename=filename.replace('.','');
    filename=filename.replace('/','');
    
    if(filename!=''){
        fs.readFile(__dirname+'/'+filename)
        .then(contents=>{
            theFile=contents;
            res.setHeader('Content-Type',filesType[extension]);
            res.writeHead(200);
            res.end(theFile);
        })
        .catch(err=>{
            console.log(`Error could not open ${filename} error : ${err} `);
            process.exit(1);
            return;
        });
    }else{
        res.setHeader('Content-Type',filesType['txt']);
        res.writeHead(200);
        res.end('Ouch : you did not put any filename in the url.');
    }
    
};

const server=http.createServer(requestListener);

server.listen(port,host,()=>{
    console.log(`The Server Is Running on http://${host}:${port}`);
});