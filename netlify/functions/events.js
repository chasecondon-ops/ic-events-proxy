export async function handler() {
  try {
    const APP_ID = process.env.PCO_APP_ID;
    const SECRET = process.env.PCO_SECRET;

    if (!APP_ID || !SECRET) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing Planning Center credentials." }),
      };
    }

    const url =
      "https://api.planningcenteronline.com/registrations/v2/events?per_page=25";

    const auth = Buffer.from(`${APP_ID}:${SECRET}`).toString("base64");

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: await response.text(),
      };
    }

    const json = await response.json();

    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - 7);

    const events = (json.data || [])
      .map((item) => {
        const a = item.attributes || {};
        return {
          id: item.id,
          title: a.name || "Event",
          startsAt: a.starts_at,
          endsAt: a.ends_at || a.starts_at,
          imageUrl: a.image_url || null,
          registrationUrl: a.public_url || null,
        };
      })
      .filter((e) => {
        if (!e.endsAt) return false;
        return new Date(e.endsAt) >= cutoff;
      })
      .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ events }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
