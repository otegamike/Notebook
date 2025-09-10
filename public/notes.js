
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

    const delBtn = (i) => {
        const delicon=`<svg width="30px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#96c703" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
        const del = `<span class="delete" id="del${i}" onclick="serverDel(${i})">${delicon}</span>`
        return del;
    }

    const data = await request.json();
    const dataSort = data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime) ) ; 
    const noteContainer = dataSort.map(note => `<li id="nt${note.id}"><div class='titleCon'><span class="bold">${note.title} </span>${delBtn(note.id)}</div><span class="content">${note.content.replaceAll("\n","<br/>")}<span>${loaddate(note.createTime)}</li>`).join("");
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
    const spin = `<svg class="spinner" width="20px" height="20px" fill="#edf9cc"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`;
    const done = `<svg height="20px" fill="#edf9cc" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="m5 16.577 2.194-2.195 5.486 5.484L24.804 7.743 27 9.937l-14.32 14.32z"/></svg>`;

    const saveEl = document.getElementById("save");
    saveEl.innerHTML = spin;

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
        saveEl.innerHTML = done;
        setTimeout(() => {
            saveEl.innerHTML = "Done";}, 2000);
    } 

    catch (error) {
       console.log("Error:", error);
    }
}


const serverDel = async (i) => {

     const id = i;
     const spinner = `<svg class="spinner" width="25px" height="25px" fill="#96c703"  viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1v2a7 7 0 1 1-7 7H1a9 9 0 1 0 9-9"/></svg>`;
     const delEl = document.getElementById(`del${i}`);
     delEl.innerHTML = spinner ;

  try {  
        const res = await fetch(("/delNote") , {
            method: "POST" ,
            headers: {"Content-type": "application/json" } ,
            body: JSON.stringify({id}) 
        })

        if (!res.ok) {
            throw new Error( "Network error");
        } else {

        const result = await res.json();
        console.log("Success!", result);
        delNote(i) }

    } catch {

    }
}

const delNote = (index) => {
    const target = "nt"+index;
    const targetEl = document.getElementById(target);
    
    if (targetEl) {
        targetEl.remove() ;
    }

    
}



