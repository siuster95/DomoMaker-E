const handleDomo = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:"hide"},350);
    
  if($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoWeight").val() =="") {
      handleError("RAWR! All fields are required");
      return false;
  }
    
  sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
     loadDomosFromServer(); 
  });
    
    return false;
};

const Delete = (e,name,id) => {
    e.preventDefault();

    let data;
    
    sendAjax("GET", "/getToken", null, (result) => {
        
    data = `name=${name}&id=${id}&_csrf=${result.csrfToken}`;
        
        
        sendAjax("POST", "/delete", data, () => {
        loadDomosFromServer(); 
        
    });


    });
      
    return false;
    
};

const Change = (e, Oldname, id) => {
    e.preventDefault();
    
    sendAjax("GET", "/getToken", null, (result) => {
        
        let name = document.querySelector("#domoIName").value;
        let age = document.querySelector("#domoIAge").value;
        let weight = document.querySelector("#domoIWeight").value;
        
        let data = `oldname=${Oldname}&name=${name}&age=${age}&weight=${weight}&id=${id}&_csrf=${result.csrfToken}`;
        
        sendAjax("POST", "/change", data, () => {
           loadDomosFromServer();
        });
        
        
    });
    
};

const EditDeleteButton = (e,name,age,weight,id) => {
    e.preventDefault();

    console.log(name);
    console.log(age);
    console.log(weight);
    console.log(id);
    

    ReactDOM.render(
        <EditDelete name={name} age={age} weight={weight} id={id} />, document.querySelector("#domos")
    );
};

const EditDelete = (props) => {
        console.log(props.weight);
        console.log(props.name);
        console.log(props.age);
        console.log(props.id);
        return (
            <div id="EditDomo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 id="NameLabel">Name: {props.name}</h3>
                <h3 id="AgeLabel">Age: {props.age}</h3>
                <h3 id="WeightDLabel">Weight: {props.weight}</h3>
                <label id="NameChangeLabel" htmlFor="name">Name: </label>
                <input id="domoIName" type="text" name="name" placeholder="Domo Name"/>
                <label id="AgeChangeLabel" htmlFor="age">Age: </label>
                <input id="domoIAge" type="text" name="age" placeholder="Domo Age"/>
                <label id="WeightChangeLabel" htmlFor="weight">Weight(in lbs): </label>
                <input id="domoIWeight" type="text" name="weight" placeholder="Domo Weight"/>
                <button id="DeleteButton" onClick={ (e) => Delete(e,props.name,props.id)}> Delete</button>
                <button id="ChangeButton" onClick={ (e) => Change(e,props.name,props.id)}> Change</button>
            </div>
        );
};

const DomoForm = (props) => {
    return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
        
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
    <label id="weightLabel" htmlFor="weight">Weight(in lbs): </label>
    <input id="domoWeight" type="text" name="weight" placeholder="Domo Weight"/>
    <input type="hidden" name="_csrf" value={props.csrf} />
    <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
    );
};

const DomoList = function(props)    {
    if(props.domos.length === 0) {
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo) {
       return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoWeight">Weight: {domo.weight} lbs</h3>
                <button onClick={ (e) => EditDeleteButton(e,domo.name,domo.age,domo.weight,domo._id)}>Edit or Delete</button>
           </div>
       ); 
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
    
}

const loadDomosFromServer = () => {
    sendAjax("GET", "/getDomos", null, (data) => {
       ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")   
       ); 
    });
}

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );  
    
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
     setup(result.csrfToken); 
  });  
};

$(document).ready(function() {
   getToken(); 
});