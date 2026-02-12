const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if(!GITHUB_TOKEN){
  console.warn('Warning: GITHUB_TOKEN is not set. The API will fail for authenticated requests.');
}

const PORT = process.env.PORT || 3000;

app.get('/discussions', async (req, res) => {
  const owner = req.query.owner;
  const repo = req.query.repo;
  if(!owner || !repo) return res.status(400).json({error:'owner and repo query params required'});

  try{
    // Use GraphQL to list discussions
    const query = `query($owner:String!, $repo:String!){ repository(owner:$owner,name:$repo){ discussions(first:30, orderBy:{field:CREATED_AT,direction:DESC}){ nodes{ id number url title bodyText createdAt author{login} labels(first:5){ nodes{ name } } } } } }`;
    const response = await axios.post('https://api.github.com/graphql', { query, variables: { owner, repo } }, {
      headers: {
        'Authorization': GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : undefined,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const nodes = response.data.data.repository.discussions.nodes;
    return res.json({ nodes });
  }catch(err){
    console.error(err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Failed to fetch discussions', details: err.response?.data || err.message });
  }
});

// Get a single discussion and its comments
app.get('/discussions/:number', async (req, res) => {
  const owner = req.query.owner;
  const repo = req.query.repo;
  const number = req.params.number;
  if(!owner || !repo) return res.status(400).json({error:'owner and repo query params required'});
  try{
    const url = `https://api.github.com/repos/${owner}/${repo}/discussions/${number}`;
    const commentsUrl = `https://api.github.com/repos/${owner}/${repo}/discussions/${number}/comments`;
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if(GITHUB_TOKEN) headers.Authorization = `token ${GITHUB_TOKEN}`;

    const [discussionRes, commentsRes] = await Promise.all([
      axios.get(url, { headers }),
      axios.get(commentsUrl, { headers })
    ]);

    return res.json({ discussion: discussionRes.data, comments: commentsRes.data });
  }catch(err){
    console.error(err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Failed to fetch discussion', details: err.response?.data || err.message });
  }
});

// Post a comment to a discussion
app.post('/discussions/:number/comments', async (req, res) => {
  const owner = req.body.owner || req.query.owner;
  const repo = req.body.repo || req.query.repo;
  const number = req.params.number;
  const body = req.body.body;
  if(!owner || !repo || !body) return res.status(400).json({error:'owner, repo and body required'});
  if(!GITHUB_TOKEN) return res.status(500).json({error:'Server not configured: GITHUB_TOKEN missing'});
  try{
    const createUrl = `https://api.github.com/repos/${owner}/${repo}/discussions/${number}/comments`;
    const createRes = await axios.post(createUrl, { body }, { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });
    return res.json(createRes.data);
  }catch(err){
    console.error(err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Failed to create comment', details: err.response?.data || err.message });
  }
});

// List discussion categories for a repo
app.get('/categories', async (req, res) => {
  const owner = req.query.owner;
  const repo = req.query.repo;
  if(!owner || !repo) return res.status(400).json({error:'owner and repo query params required'});
  try{
    const url = `https://api.github.com/repos/${owner}/${repo}/discussion-categories`;
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if(GITHUB_TOKEN) headers.Authorization = `token ${GITHUB_TOKEN}`;
    const cats = await axios.get(url, { headers });
    return res.json(cats.data);
  }catch(err){
    console.error(err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Failed to fetch categories', details: err.response?.data || err.message });
  }
});

app.post('/discussions', async (req, res) => {
  const { owner, repo, title, body } = req.body || {};
  if(!owner || !repo || !title) return res.status(400).json({error:'owner, repo, and title required'});
  if(!GITHUB_TOKEN) return res.status(500).json({error:'Server not configured: GITHUB_TOKEN missing'});

  try{
    // fetch categories to pick a category id
    const urlCats = `https://api.github.com/repos/${owner}/${repo}/discussion-categories`;
    const catsRes = await axios.get(urlCats, { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });
    const availableCats = catsRes.data || [];
    // allow client to provide category_id, otherwise fall back to first category
    const clientCategory = req.body.category_id || null;
    const category_id = clientCategory || (availableCats[0] && availableCats[0].id) || null;

    const createUrl = `https://api.github.com/repos/${owner}/${repo}/discussions`;
    const payload = { title, body: body || '', category_id };
    const createRes = await axios.post(createUrl, payload, { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });
    return res.json(createRes.data);
  }catch(err){
    console.error(err.response ? err.response.data : err.message);
    return res.status(500).json({ error: 'Failed to create discussion', details: err.response?.data || err.message });
  }
});

app.listen(PORT, ()=>console.log(`forum-api listening on ${PORT}`));
