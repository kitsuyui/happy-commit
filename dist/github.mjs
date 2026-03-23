import{t as e}from"./github-30evUmUL.mjs";function t(e,t){let{lucky:n,body:r}=t;return n?e?e.body===r?{type:`noop`}:{type:`update`,commentId:e.id,body:r}:{type:`create`,body:r}:e?{type:`delete`,commentId:e.id}:{type:`noop`}}async function n(n,i,a,o){let s=e,c=t(await r(n,i,a),o);switch(c.type){case`update`:await n.issues.updateComment({...s.repo,comment_id:c.commentId,body:c.body});return;case`create`:await n.issues.createComment({...s.repo,issue_number:i,body:c.body});return;case`delete`:await n.issues.deleteComment({...s.repo,comment_id:c.commentId});return;case`noop`:return}}async function r(t,n,r){let i=e,a=await t.issues.listComments({...i.repo,issue_number:n});for(let e of a.data)if(e.user?.login===r)return{id:e.id,body:e.body_text||``};return null}async function i(t){let n=e;return(await t.pulls.listCommits({...n.repo,pull_number:n.issue.number})).data.map(e=>e.sha)}async function a(e){return(await e.graphql(`
query {
  viewer {
    login
  }
}`)).viewer.login}export{t as decideCommentAction,i as getCommitIds,a as getUserLogin,n as updateMessage};
//# sourceMappingURL=github.mjs.map