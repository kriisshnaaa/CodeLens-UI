import { useRef, useState } from "react";

export default function UploadBox({ onResult }) {

  const [file,setFile]=useState(null);
  const [loading,setLoading]=useState(false);
  const [present,setpresent]=useState(true);

  const fileInputRef=useRef(null);

  const handleUpload=async()=>{

    if(!file){
      setpresent(false);
      return;
    }

    setLoading(true);

    setTimeout(()=>{

      const demoTree=[

        {
          name:file.name.replace(".zip",""),
          children:[
            {
              name:"src",
              children:[
                {name:"App.jsx",path:"src/App.jsx"},
                {name:"index.js",path:"src/index.js"}
              ]
            },
            {
              name:"package.json",
              path:"package.json"
            }
          ]
        }

      ];

      onResult(demoTree);
      setLoading(false);

    },800);

  };

  return(

    <div className="upload-card">

      <h1>Upload Repository</h1>

      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        style={{display:"none"}}
        onChange={(e)=>setFile(e.target.files[0])}
      />

      <div
        onClick={()=>fileInputRef.current.click()}
        style={{
          marginTop:20,
          padding:"16px",
          border:"2px dashed #d1d5db",
          borderRadius:10,
          cursor:"pointer",
          background:"#f9fafb"
        }}
      >

        {file ? file.name : "Click to select ZIP"}

      </div>

      <p style={{color:"red",fontSize:13}}>
        {!present ? "Please select a file":""}
      </p>

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{marginTop:16}}
      >

        {loading ? "Uploading..." : "Upload & Explore"}

      </button>

    </div>

  );

}