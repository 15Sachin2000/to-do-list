const express=require('express');
const app=express();
const bp=require('body-parser');
const mongoose=require('mongoose');
const _=require('lodash');
mongoose.connect("mongodb://localhost/databd");
const sch=new mongoose.Schema({
    name: String
});
const nsch=new mongoose.Schema({
    name:String,
    dat:[sch]
});
const mdl1=mongoose.model('random',nsch);
const mdl=mongoose.model('data',sch);
const d1=new mdl({
    name:"Get up at 6 am"
});
const d2=new mdl({
    name:"Do Coding"
});
const d3=new mdl({
    name:"Then do Web Devlopment"
});

app.use(bp.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');
app.get('/',function(req,res){
    mdl.find(function(err,dt){
        if(dt.length===0)
        {
            mdl.insertMany([d1,d2,d3],function(err){
                if(err)
                console.log(err);
                else
                console.log('successfully inserted initial data');
            });
            res.redirect('/');
        }
        else
        {
            //console.log(dt);
            res.render('index',{nm:"To-Do List",tmp:dt});
        }
    })
});
app.get("/:kuchbhi",function(req,res){
    const rr=_.capitalize(req.params.kuchbhi);
    mdl1.findOne({name:rr},function(err,result){
        if(err)
        console.log(err);
        else
        {
            if(!result)
            {
                const naya=new mdl1({
                    name:rr,
                    dat:[d1,d2,d3]
                });
                console.log('abhi naya banaya');
                naya.save();
                res.redirect("/"+req.params.kuchbhi);
            }
            else
            {
                res.render('index',{nm:result.name,tmp:result.dat});
            }
        }
    });
});
app.post("/del",function(req,res){
    console.log(req.body);
    if(req.body.hid==="To-Do List")
    {
        mdl.findByIdAndRemove(req.body.del,function(err){
            if(err)
            console.log(err);
            else
            console.log('deleted successfully');
        });
        res.redirect("/");
    }
    else{
        mdl1.findOne({name:req.body.hid},function(err,result){
            if(err)
            console.log(err);
            else
            {
                result.dat.pull({_id:req.body.del});
                result.save();
            }
        });
        res.redirect('/'+req.body.hid);
    }
    
});
app.post('/',function(req,res){
    if(req.body.sub==="To-Do List")
    {
        const w=new mdl({
            name:req.body.bta
        });
        w.save();
        res.redirect('/');
    }
    else{
        const qw={
            name:req.body.bta
        };
        mdl1.findOne({name:req.body.sub},function(err,result){
            if(err)
            console.log(err);
            else
            result.dat.push(qw);
            result.save();
        });
        res.redirect("/"+req.body.sub);
    }
})
app.listen('3000',function(){
    console.log('server is listening at port 3000');
});