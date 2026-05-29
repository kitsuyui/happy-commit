import{t as e}from"./github-D91hw1gk.mjs";const t=`<!-- happy-commit:v1 -->`,n=[t,...[`<!-- happy-commit -->`]];function r(e){return`${t}\n${e}`}function i(e){return n.some(t=>e.includes(t))}function a(e,t){return e?e.body===t?{type:`noop`}:{type:`update`,commentId:e.id,body:t}:{type:`create`,body:t}}function o(e,t){return t.lucky?a(e,r(t.body)):e?{type:`delete`,commentId:e.id}:{type:`noop`}}async function s(t,n,r){let i=e,a=await d(t,n,r);for(let e of a.slice(0,-1))await t.issues.deleteComment({...i.repo,comment_id:e.id});return a.length>0?a[a.length-1]:null}async function c(e,t,n,r){await l(e,t,n,o(await s(e,t,n),r))}async function l(t,n,r,i){let a=e;switch(i.type){case`update`:await t.issues.updateComment({...a.repo,comment_id:i.commentId,body:i.body});return;case`create`:await t.issues.createComment({...a.repo,issue_number:n,body:i.body}),await s(t,n,r);return;case`delete`:await t.issues.deleteComment({...a.repo,comment_id:i.commentId});return;case`noop`:return}}async function u(t,n){let r=e,i=[],a=1,o=!0;for(;o;){let{data:e}=await t.issues.listComments({...r.repo,issue_number:n,per_page:100,page:a});i.push(...e),o=e.length>=100,a++}return i}async function d(e,t,n){return(await u(e,t)).filter(e=>f(e,n)).map(e=>({id:e.id,body:e.body||e.body_text||``})).sort((e,t)=>e.id-t.id)}function f(e,t){return e.user?.login===t&&i(e.body||e.body_text||``)}async function p(t){let n=e;return(await t.paginate(t.pulls.listCommits,{...n.repo,pull_number:n.issue.number,per_page:100})).map(e=>e.sha)}async function m(t,n){let r=e,i=(await t.graphql(`
query ($owner: String!, $repo: String!, $expression: String!) {
  repository(owner: $owner, name: $repo) {
    object(expression: $expression) {
      ... on Commit {
        history(first: 1) {
          totalCount
        }
      }
    }
  }
}
`,{owner:r.repo.owner,repo:r.repo.repo,expression:`refs/heads/${n}`})).repository?.object?.history?.totalCount;if(typeof i!=`number`)throw Error(`Could not resolve commit count for ${n}`);return i}async function h(e){let t=(await e.graphql(`
query {
  viewer {
    login
  }
}`)).viewer?.login;if(typeof t!=`string`||t.length===0)throw Error(`Could not resolve current user login`);return t}export{o as decideCommentAction,p as getCommitIds,m as getRepositoryCommitCount,h as getUserLogin,c as updateMessage};
//# sourceMappingURL=github.mjs.map