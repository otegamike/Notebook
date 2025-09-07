
async function getNotes() {
    const request = await fetch("/getNotes");

    const loaddate= (date) => {
        const dt = new Date(date);
        const now = new Date();
        let newDate = "";

        const datediff = now - dt;
        const diffSec = Math.floor(datediff/1000) ;
        const diffMin = Math.floor(diffSec/60) ;
        const diffHr = Math.floor(diffMin/60) ;
        const diffDay = Math.floor(diffHr/24) ;
        const diffWk = Math.floor(diffDay/7) ;

        if (diffWk>=4) {
            const option = { month: "short" , year : "numeric"} ;
            newDate = dt.toLocaleDateString("en-Us" , option) ;
        } else if (diffWk<4&&diffWk>0) {
            newDate = `${diffWk} weeks ago` ;
        } else if (diffDay<7&&diffDay>0) {
            newDate = `${diffDay} days ago` ;
           if (diffDay === 1)  {newDate="yesterday" ; }
        } else if (diffHr>0) {
            newDate = `${diffHr} hours ago`
        } else if (diffMin>0) {
            newDate = `${diffMin} mins ago` ;
            if (diffMin === 1)  {newDate="just now" ; }
        } else if (diffSec>=0) {
            newDate = `just now`
        }


        const d = `<div class="dateCon" id="dateCon"><span class="date" id="date">${newDate}</span></div>` ;
        return d;

    };

    const data = await request.json();
    const dataSort = data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime) ) ; 
    const noteContainer = dataSort.map(note => `<li><div class="bold">${note.title}</div><span class="content">${note.content.replaceAll("\n","<br/>")}<span>${loaddate(note.createTime)}</li>`).join("");
    const noteUl = `<ul>${noteContainer}</ul>`;
    document.getElementById("notes").innerHTML=noteUl;


}

window.onload = getNotes;

const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const textareaEl =document.getElementById("inputarea");

const formatTitle = () => {
    const x = document.getElementById("title");
    const y = x.value;
    const z = y.trim();

    if (z.includes(" ")) {
        let titleArr = y.split(" ");

        titleArr.forEach((item, i, arr) => {
           arr[i] = item.charAt(0).toUpperCase() + item.slice(1) ;
        });
      x.value= titleArr.join(" ");
    }

    else {
        x.value =  y.charAt(0).toUpperCase() + y.slice(1) ;
    }
}

const saveNote = async () => {
    
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const createTime = new Date().toISOString();

    const saveEl = document.getElementById("save");
    saveEl.innerHTML = '<img src="/Notebook/src/load.png" width="20px" alt="loading..." />';

    if (content==="") {
        const c = document.getElementById("content");
        c.placeholder = "Note can't be empty..."
        saveEl.innerHTML = "x";
        setTimeout(()=> {
            c.placeholder = "Take a note..."
            saveEl.innerHTML = "Done"; } , 2000) ;
        return
    }

    try {
        const res = await fetch(("/newNote"), {
            method: "POST",
            headers:  {"Content-type" : "application/json"},
            body: JSON.stringify({title , content, createTime })
        })

        if (!res.ok) {
            throw new Error("Network response was not okay") ;
        }

        const result = await res.json();
        console.log("Success!", result);
        saveEl.innerHTML = '<img src="/Notebook/src/check.png" width="20px" alt="done" />';
        setTimeout(() => {
            saveEl.innerHTML = "Done";}, 2000);
    } 

    catch (error) {
       console.log("Error:", error);
    }
}





