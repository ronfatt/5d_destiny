import { prisma } from "@/lib/prisma";

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

export default async function AdminPage() {
  const [
    totalUsers,
    totalBirthProfiles,
    totalReadings,
    totalReports,
    totalCards,
    totalCharts,
    latestReadings,
    latestReports,
    latestBirthProfiles,
    latestCharts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.birthProfile.count(),
    prisma.destinyReading.count(),
    prisma.destinyReport.count(),
    prisma.destinyCard.count(),
    prisma.ziweiChart.count(),
    prisma.destinyReading.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        birthProfile: true,
        fiveDimensionScore: true,
        reports: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    }),
    prisma.destinyReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        reading: {
          select: {
            id: true,
            theme: true,
            question: true
          }
        }
      }
    }),
    prisma.birthProfile.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    }),
    prisma.ziweiChart.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        birthProfile: {
          select: {
            id: true,
            birthLocation: true,
            birthTime: true
          }
        }
      }
    })
  ]);

  const statCards = [
    { label: "Users", value: totalUsers },
    { label: "Birth Profiles", value: totalBirthProfiles },
    { label: "Readings", value: totalReadings },
    { label: "Reports", value: totalReports },
    { label: "Destiny Cards", value: totalCards },
    { label: "Ziwei Charts", value: totalCharts }
  ];

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">Admin Console</div>
        <h1>Monitor readings, reports, cards, and Ziwei chart generation.</h1>
        <p>
          This page is the first internal operations surface. It shows whether the five-dimension pipeline is
          writing real records across the system, not just returning transient API responses.
        </p>
      </section>

      <section className="statsGrid">
        {statCards.map((item) => (
          <article className="statCard" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Latest Readings</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Reading</th>
                  <th>Theme</th>
                  <th>Status</th>
                  <th>Birth City</th>
                  <th>Scores</th>
                  <th>Latest Report</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {latestReadings.map((reading) => (
                  <tr key={reading.id}>
                    <td>
                      <a href={`/readings/${reading.id}`}>{reading.id.slice(0, 12)}</a>
                    </td>
                    <td>{reading.theme}</td>
                    <td>{reading.status}</td>
                    <td>{reading.birthProfile?.birthLocation ?? "-"}</td>
                    <td>
                      {reading.fiveDimensionScore
                        ? `C ${reading.fiveDimensionScore.careerScore} / W ${reading.fiveDimensionScore.wealthScore} / L ${reading.fiveDimensionScore.loveScore} / H ${reading.fiveDimensionScore.healthScore}`
                        : "-"}
                    </td>
                    <td>{reading.reports[0]?.reportVersion ?? "-"}</td>
                    <td>{formatDate(reading.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card" style={{ gridColumn: "span 6" }}>
          <h2>Latest Reports</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Reading</th>
                  <th>Version</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {latestReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id.slice(0, 12)}</td>
                    <td>
                      <a href={`/readings/${report.readingId}`}>{report.readingId.slice(0, 12)}</a>
                    </td>
                    <td>{report.reportVersion}</td>
                    <td>{formatDate(report.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card" style={{ gridColumn: "span 6" }}>
          <h2>Latest Birth Profiles</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>User</th>
                  <th>Location</th>
                  <th>Birth Time</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {latestBirthProfiles.map((profile) => (
                  <tr key={profile.id}>
                    <td>{profile.id.slice(0, 12)}</td>
                    <td>{profile.user.email}</td>
                    <td>{profile.birthLocation}</td>
                    <td>{profile.birthTime}</td>
                    <td>{formatDate(profile.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card" style={{ gridColumn: "span 12" }}>
          <h2>Latest Ziwei Charts</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Chart</th>
                  <th>Birth Profile</th>
                  <th>Location</th>
                  <th>Engine</th>
                  <th>School</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {latestCharts.map((chart) => (
                  <tr key={chart.id}>
                    <td>{chart.id.slice(0, 12)}</td>
                    <td>{chart.birthProfile.id.slice(0, 12)}</td>
                    <td>{chart.birthProfile.birthLocation}</td>
                    <td>{chart.engineVersion}</td>
                    <td>{chart.school}</td>
                    <td>{formatDate(chart.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
