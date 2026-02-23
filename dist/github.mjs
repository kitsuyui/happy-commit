import{t as e}from"./github-30evUmUL.mjs";async function t(t,r,i,a){let o=e,s=await n(t,r,i),{lucky:c,body:l}=a;c?s&&s.body!==l?await t.issues.updateComment({...o.repo,comment_id:s.id,body:l}):await t.issues.createComment({...o.repo,issue_number:r,body:l}):s&&await t.issues.deleteComment({...o.repo,comment_id:s.id})}async function n(t,n,r){let i=e,a=await t.issues.listComments({...i.repo,issue_number:n});for(let e of a.data)if(e.user?.login===r)return{id:e.id,body:e.body_text||``};return null}async function r(t){let n=e;return(await t.pulls.listCommits({...n.repo,pull_number:n.issue.number})).data.map(e=>e.sha)}async function i(e){return(await e.graphql(`
query {
  viewer {
    login
  }
}`)).viewer.login}export{r as getCommitIds,i as getUserLogin,t as updateMessage};
//# sourceMappingURL=github.mjs.map