export async function handler() {
// netlify/functions/events.js

exports.handler = async function () {
try {
const APP_ID = process.env.PCO_APP_ID;
const SECRET = process.env.PCO_SECRET;
@@ -31,9 +33,8 @@ export async function handler() {

const json = await response.json();

    const now = new Date();
const cutoff = new Date();
    cutoff.setDate(now.getDate() - 7);
    cutoff.setDate(cutoff.getDate() - 7);

const events = (json.data || [])
.map((item) => {
@@ -47,10 +48,7 @@ export async function handler() {
registrationUrl: a.public_url || null,
};
})
      .filter((e) => {
        if (!e.endsAt) return false;
        return new Date(e.endsAt) >= cutoff;
      })
      .filter((e) => e.endsAt && new Date(e.endsAt) >= cutoff)
.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

return {
@@ -67,4 +65,4 @@ export async function handler() {
body: JSON.stringify({ error: error.message }),
};
}
}
};
