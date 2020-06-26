(function(){
    if(localStorage.getItem('sessionStorage')===null) {
      window.memoryStorage={};
    } else{ 
      window.memoryStorage=JSON.parse(localStorage.getItem('sessionStorage'));
    } 
    function isEmpty(o){
      for(var i in o){
        return false;
      }
      return true;
    };
    if(isEmpty(memoryStorage)) { 
      localStorage.setItem('getSessionStorage',Date.now());
    };
    function storageChange (event) {
      if(event.key === 'logged_in') {
          memoryStorage = {};
          localStorage.removeItem("sessionStorage");
          //localStorage.clear();
          window.location.reload();
      }
    }
    window.addEventListener('storage', storageChange, false)

    window.addEventListener('storage',function(event){
      if(event.key=='getSessionStorage'){
        localStorage.setItem('sessionStorage',JSON.stringify(memoryStorage));
        localStorage.removeItem('sessionStorage');
      } else if(event.key=='sessionStorage'&&isEmpty(memoryStorage)){
        var data=JSON.parse(event.newValue),value;
        for(key in data){
          memoryStorage[key]=data[key];
        }
        var el=!isEmpty(memoryStorage)?JSON.stringify(memoryStorage):'memoryStorage is empty';
      }
    });
    window.onbeforeunload=function(){};
})();
