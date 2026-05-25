export default function handler(_req: any, res: any) {
  res.status(200).json({
    ok: true,
    service: 'hvntontcalendar',
    updatedAt: new Date().toISOString(),
  });
}
