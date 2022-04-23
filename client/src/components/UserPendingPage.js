import React from "react";

export default function UserPendingPage({workflowStatus, Owner, accounts}){

    if((workflowStatus == -1 || workflowStatus == 0) && (accounts[0] !== Owner ) ){
        return(
            <div style={{marginTop : '100px'}} >
                <h1>L'éléction n'a pas commencé...</h1>
            </div>
        )
    }else return null
}