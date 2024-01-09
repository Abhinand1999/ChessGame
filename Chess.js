let legalSquares=[]
let isWhiteTurn=true;
const boardSquares = document.getElementsByClassName("square");
const pieces=document.getElementsByClassName("piece");
const piecesImages=document.getElementsByTagName("img");
const setupBoardSquares=()=>{
    for(let i=0;i<boardSquares.length;i++){
        boardSquares[i].addEventListener('dragover',allowDrop)
        boardSquares[i].addEventListener('drop',drop)
        let row=8-Math.floor(i/8);
        
        let column=String.fromCharCode(97+(i%8))
        let square=boardSquares[i];
        square.id=column+row;
    }
 }

 const setupPieces=()=>
{
    for(let i=0;i<pieces.length;i++)
    {
        pieces[i].addEventListener("dragstart",drag)
        pieces[i].setAttribute("draggable",true)
        pieces[i].id=pieces[i].className.split(" ")[1]+pieces[i].parentElement.id 
       }
       for(let i=0;i<piecesImages.length;i++)
       {
        piecesImages[i].setAttribute("draggable",false)
       }
      
}

const allowDrop=(ev)=>
{
    ev.preventDefault();
}
const drag=(ev)=>
{
    const piece=ev.target;
    const pieceColor=piece.getAttribute("color")
    if((isWhiteTurn && pieceColor=="white")||(!isWhiteTurn && pieceColor=="Black"))
    {
        ev.dataTransfer.setData("text",piece.id)
        const startingSquareId=piece.parentNode.id;
        getPossibleMoves(startingSquareId,piece)
    }       
}

const drop=(ev)=>{
    ev.preventDefault();
    let data=ev.dataTransfer.getData("text")
    const piece=document.getElementById(data)
    // console.log(piece,"e")
    const destinationSquare=ev.currentTarget;
    // console.log(destinationSquare,"hu")
    let destinationSquareId=destinationSquare.id
    if((isSquareOccupied(destinationSquare)=="blank")&&(legalSquares.includes(destinationSquareId))){

        destinationSquare.appendChild(piece)
        isWhiteTurn=!isWhiteTurn;
        legalSquares.length=0
        return
    }
    if((isSquareOccupied(destinationSquare)!=="blank")&&(legalSquares.includes(destinationSquareId))){
        while(destinationSquare.firstChild){
            destinationSquare.removeChild(destinationSquare.firstChild)
        }
        destinationSquare.appendChild(piece)
        isWhiteTurn=!isWhiteTurn;
        legalSquares.length=0
        return
    }

 }

 function getPossibleMoves(startingSquareId,piece)
{
    const pieceColor=piece.getAttribute("color");
    console.log(piece.classList.contains("rook"))
    if(piece.classList.contains("pawn"))
        {
            getPawnMoves(startingSquareId,pieceColor);
        }
    if(piece.classList.contains("knight"))
    {
         getKnightMoves(startingSquareId,pieceColor);
     }
     if(piece.classList.contains("rook"))
     {
          getRookMoves(startingSquareId,pieceColor);
      }
      if(piece.classList.contains("bishop"))
     {
          getBishopMoves(startingSquareId,pieceColor);
      }
      if(piece.classList.contains("queen"))
     {
          getQueenpMoves(startingSquareId,pieceColor);
      }
      if(piece.classList.contains("king"))
        {
          getKingpMoves(startingSquareId,pieceColor);
      }
 }

setupBoardSquares()
setupPieces()

const isSquareOccupied=(square)=>{
    if(square.querySelector(".piece")){
        const color =square.querySelector(".piece").getAttribute("color");
        return color;
    }else
    {
        return "blank"
    }
}
function getPawnMoves(startingSquareId,pieceColor){
    checkPawnDiagonalCaptures(startingSquareId,pieceColor)
    checkPawnForwardMoves(startingSquareId,pieceColor)
}
function checkPawnDiagonalCaptures(startingSquareId,pieceColor)
{   
    const file=startingSquareId.charAt(0)
    console.log(file,"file")
    const rank=startingSquareId.charAt(1);
    console.log(rank,"rank")
    const rankNumber=parseInt(rank)
    console.log(rankNumber,"rankNumber")
    let currentFile=file
    let currentRank=rankNumber
    let currentSquareId=currentFile+currentRank;
    let currentSquare=document.getElementById(currentSquareId)
    let squareContent=isSquareOccupied(currentSquare);
    const direction=pieceColor=="white"?1:-1;
    currentRank+=direction
    for(let i=-1;i<=1;i+=2)
    {
        currentFile=String.fromCharCode(file.charCodeAt(0)+i)
        if(currentFile>="a" && currentFile<="h")
        {
            currentSquareId=currentFile+currentRank;
            currentSquare=document.getElementById(currentSquareId)
            squareContent=isSquareOccupied(currentSquare)
            if(squareContent!= "blank" && squareContent != pieceColor)
            {
                legalSquares.push(currentSquareId)
            }
        }
    }
}
function checkPawnForwardMoves(startingSquareId,pieceColor)
{
    const file=startingSquareId.charAt(0)
    const rank=startingSquareId.charAt(1);
    const rankNumber=parseInt(rank)
    let currentFile=file
    let currentRank=rankNumber
    let currentSquareId=currentFile+currentRank;
    let currentSquare=document.getElementById(currentSquareId)
    let squareContent=isSquareOccupied(currentSquare);
    const direction=pieceColor=="white"?1:-1;
    currentRank+=direction
    currentSquareId=currentFile+currentRank;
    currentSquare=document.getElementById(currentSquareId)
    squareContent=isSquareOccupied(currentSquare)
    if(squareContent!= "blank")
        return
        legalSquares.push(currentSquareId)
        if(rankNumber!=2 && rankNumber !=7)return
        currentRank+=direction
        currentSquareId=currentFile+currentRank;
        currentSquare=document.getElementById(currentSquareId)
        squareContent=isSquareOccupied(currentSquare)
        if(squareContent!= "blank")
            return
            legalSquares.push(currentSquareId)
}

function getKnightMoves(startingSquareId,pieceColor)
{
    const file=startingSquareId.charCodeAt(0)-97;
    console.log(file,"file")
    const rank=startingSquareId.charAt(1)
    console.log(rank,"rank")
    const rankNumber=parseInt(rank);
    
    let currentFile=file
    let currentRank=rankNumber
    const moves=[[-2,1],[-1,2],[1,2],[2,-1],[1,-2],[-1,-2],[-2,-1]]
    moves.forEach((move)=>{currentFile=file+move[0]
        currentRank=rankNumber+move[1]
        console.log(currentRank,"currentRank")
        if(currentFile>=0 && currentFile<=7 && currentRank>0 && currentRank<=8)
        {
            let currentSquareId=String.fromCharCode(currentFile+97)+currentRank
            let currentSquare=document.getElementById(currentSquareId)
            let squareContent=isSquareOccupied(currentSquare);
            if(squareContent!="blank" && squareContent==pieceColor)
            
                return;
                legalSquares.push(String.fromCharCode(currentFile+97)+currentRank);
            
        }

    })
}



function getRookMoves(startingSquareId,pieceColor){
    moveToEighthRank(startingSquareId,pieceColor)
  
    moveToFirstRank(startingSquareId,pieceColor)
    moveToAFile(startingSquareId,pieceColor)
    moveToHFile(startingSquareId,pieceColor)
}
 function moveToEighthRank(startingSquareId,pieceColor){
    const file=startingSquareId.charAt(0)
    const rank =startingSquareId.charAt(1);
    const rankNumber=parseInt(rank)
    let currentRank=rankNumber
    while(currentRank!=8)
    {
        currentRank++
        let currentSquareId=file+currentRank;
        let  currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent==pieceColor)
            return
        legalSquares.push(currentSquareId)
        if(squareContent!="blank" && squareContent!=pieceColor)
        return
    }
    return

 }

 function moveToFirstRank(startingSquareId,pieceColor){
    const file=startingSquareId.charAt(0)
    const rank =startingSquareId.charAt(1);
    const rankNumber=parseInt(rank)
    let currentRank=rankNumber
    while(currentRank!=1)
    {
        currentRank--
        let currentSquareId=file+currentRank;
        let  currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent==pieceColor)
            return
        legalSquares.push(currentSquareId)
        if(squareContent!="blank" && squareContent!=pieceColor)
        return
    }
    return

 }

 
 function moveToAFile(startingSquareId,pieceColor){
    const file=startingSquareId.charAt(0)
    const rank =startingSquareId.charAt(1);
    const rankNumber=parseInt(rank)
    let currentFile=file
    while(currentFile!="a")
    {
        currentFile=String.fromCharCode(currentFile.charCodeAt(currentFile.length-1)-1)
        let currentSquareId=currentFile+rank;
        let  currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent==pieceColor)
            return
        legalSquares.push(currentSquareId)
        if(squareContent!="blank" && squareContent!=pieceColor)
        return
    }
    return

 }

  
 function moveToHFile(startingSquareId,pieceColor)
 {
    const file=startingSquareId.charAt(0)
    const rank =startingSquareId.charAt(1);
    const rankNumber=parseInt(rank)
    let currentFile=file
    while(currentFile!="h")
    {
        currentFile=String.fromCharCode(currentFile.charCodeAt(currentFile.length-1)+1)
        console.log(currentFile,"hellow")
        let currentSquareId=currentFile+rank;
        let  currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent==pieceColor)
            return
        legalSquares.push(currentSquareId)
        if(squareContent!="blank" && squareContent!=pieceColor)
        return
    }
    return

 }


 function getBishopMoves(startingSquareId,pieceColor){
    moveToEighthRankHFile(startingSquareId,pieceColor)
    moveToEighthRankAFile(startingSquareId,pieceColor)
    moveToFirstRankHFile(startingSquareId,pieceColor)
    moveToFirstRankAFile(startingSquareId,pieceColor)
 }

 function moveToEighthRankAFile(startingSquareId,pieceColor)
 {
    const file=startingSquareId.charAt(0)
    const rank=startingSquareId.charAt(1)
    const rankNumber=parseInt(rank)
    let currentFile=file
    let currentRank=rankNumber
    while(!(currentFile=="a" || currentRank==8))
    { currentFile=String.fromCharCode(currentFile.charCodeAt(currentFile.length-1)-1)
        currentRank++
        let currentSquareId=currentFile+currentRank
        let currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent==pieceColor)
            return
            legalSquares.push(currentSquareId)
            if(squareContent!="blank" && squareContent!=pieceColor)
            return
    }
 }

 function moveToEighthRankHFile(startingSquareId,pieceColor)
 {
    const file=startingSquareId.charAt(0)
    const rank=startingSquareId.charAt(1)
    const rankNumber=parseInt(rank)
    let currentFile=file
    let currentRank=rankNumber
    while(!(currentFile=="h" || currentRank==8))
    { currentFile=String.fromCharCode(currentFile.charCodeAt(currentFile.length-1)+1)
        currentRank++
        let currentSquareId=currentFile+currentRank
        let currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent!=pieceColor)
            return
            legalSquares.push(currentSquareId)
            if(squareContent!="blank" && squareContent!=pieceColor)
            return
    }
 }


 function moveToFirstRankAFile(startingSquareId,pieceColor)
 {
    const file=startingSquareId.charAt(0)
    const rank=startingSquareId.charAt(1)
    const rankNumber=parseInt(rank)
    let currentFile=file
    let currentRank=rankNumber
    while(!(currentFile=="a" || currentRank==1))
    { currentFile=String.fromCharCode(currentFile.charCodeAt(currentFile.length-1)-1)
        currentRank--
        let currentSquareId=currentFile+currentRank
        let currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent!=pieceColor)
            return
            legalSquares.push(currentSquareId)
            if(squareContent!="blank" && squareContent!=pieceColor)
            return
    }
 }


 function moveToFirstRankHFile(startingSquareId,pieceColor)
 {
    const file=startingSquareId.charAt(0)
    const rank=startingSquareId.charAt(1)
    const rankNumber=parseInt(rank)
    let currentFile=file
    let currentRank=rankNumber
    while(!(currentFile=="h" || currentRank==1))
    { currentFile=String.fromCharCode(currentFile.charCodeAt(currentFile.length-1)+1)
        currentRank--
        let currentSquareId=currentFile+currentRank
        let currentSquare=document.getElementById(currentSquareId)
        let squareContent=isSquareOccupied(currentSquare)
        if(squareContent!="blank" && squareContent==pieceColor)
            return
            legalSquares.push(currentSquareId)
            if(squareContent!="blank" && squareContent!=pieceColor)
            return
    }
 }


function getQueenpMoves(startingSquareId,pieceColor){
    moveToEighthRankHFile(startingSquareId,pieceColor)
    moveToEighthRankAFile(startingSquareId,pieceColor)
    moveToFirstRankHFile(startingSquareId,pieceColor)
    moveToFirstRankAFile(startingSquareId,pieceColor)
    moveToEighthRank(startingSquareId,pieceColor)
    moveToFirstRank(startingSquareId,pieceColor)
    moveToAFile(startingSquareId,pieceColor)
    moveToHFile(startingSquareId,pieceColor)
}

function getKingpMoves(startingSquareId,pieceColor){
    const file=startingSquareId.charCodeAt(0)-97;
    console.log(file,"file")
    const rank=startingSquareId.charAt(1)
    console.log(rank,"rank")
    const rankNumber=parseInt(rank);
    let currentFile=file
    let currentRank=rankNumber
    const moves=[[0,1],[0,-1],[1,1],[1,-1],[-1,0],[-1,-1],[-1,1],[1,0]]
    moves.forEach((move)=>{currentFile=file+move[0]
        currentRank=rankNumber+move[1]
        console.log(currentRank,"currentRank")
        if(currentFile>=0 && currentFile<=7 && currentRank>0 && currentRank<=8)
        {
            let currentSquareId=String.fromCharCode(currentFile+97)+currentRank
            let currentSquare=document.getElementById(currentSquareId)
            let squareContent=isSquareOccupied(currentSquare);
            if(squareContent!="blank" && squareContent==pieceColor)
            
                return;
                legalSquares.push(String.fromCharCode(currentFile+97)+currentRank);
            
        }

    })
}