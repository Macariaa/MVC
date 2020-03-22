const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
app.use(express.json())

app.get('/api/tasks/', (req, res) => fs.readFile('./data.json','utf-8',(err,data) => {
  if(err) {
    res.status(500).send()
  }else {
    res.json(JSON.parse(data))
  }
}))

asyncReadFile =function(path){
  return new Promise(
    function(resolve,reject){
        fs.readFile(path,'utf-8',function(err,data){
            if(err){
                reject(err)
            }
            resolve(data)
        })
    }
    ).catch(err=>{
        return err
    })
}

const asyncWriteFile =function (string,path){
  return new Promise(function(resolve,reject){
      fs.writeFile(path,string,function(err,data){
          if(err){
              reject(err)
          }
          resolve(data)
      })
  }).catch(err=>{
      return err
  })

}

const createTasks = async(req,res)=>{
  newTasks=req.body
  const file= await asyncReadFile('./data.json')
  const tasks=JSON.parse(file)
  if(tasks.filter(v=>v.id===newTasks.id).length!=0){
    res.status(400).send
}else{
  tasks.push(newTasks)
  await asyncReadFile('./data.json',JSON.stringify(tasks))
  await asyncWriteFile(JSON.stringify(tasks),'./data.json')
  res.status(201).send(tasks)
}
}
app.post('/api/tasks/',createTasks)
app.get('/api/tasks/:id',async (req,res)=>{
  const file = await asyncReadFile('./data.json') 
  const tasks = JSON.parse(file)
  if(tasks.filter(v=>v.id==req.params.id).length!=0){
      for(var i=0;i<tasks.length;i++){
          if(tasks[i].id==req.params.id){
              res.status(201).send(tasks[i])
              return
          }
      }
  }else{
      res.send('未找到指定id')
  }
})

app.delete('/api/tasks/:id',async (req,res)=>{
  const file = await asyncReadFile('./data.json') 
  const tasks = JSON.parse(file)
  if(tasks.filter(v=>v.id==req.params.id).length!=0){
      for(var i=0;i<tasks.length;i++){
          if(tasks[i].id==req.params.id){
              tasks.splice(i,1)
          }
      }
      await asyncWriteFile(JSON.stringify(tasks),'./data.json')
      res.status(201).send(tasks)
  }else{
      res.send('未找到指定id')
  }
  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

exports.app =app