const SubGroup = requrie('../../../models/sub_group');

const DeleteSub = id=>{
    return new Promise(async (resolve,reject)=>{
        let sub = await SubGroup.findById(id);
        if(!sub){
            return reject({
                code: 404,
                msg:`Sub group not found!`
            })
        }
       
        
    })
}


module.exports = [
    DeleteSub
]