import { prisma } from "@/lib/prisma";

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
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
    { label: "用户数", value: totalUsers },
    { label: "出生资料数", value: totalBirthProfiles },
    { label: "读取数", value: totalReadings },
    { label: "报告数", value: totalReports },
    { label: "命运卡数", value: totalCards },
    { label: "紫微命盘数", value: totalCharts }
  ];

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">后台控制台</div>
        <h1>查看读取、报告、卡牌与紫微命盘生成情况。</h1>
        <p>这是第一版内部运营界面，用来确认五维主链是否真的在持续写入数据库，而不是只返回临时接口结果。</p>
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
          <h2>最新读取</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>读取</th>
                  <th>主题</th>
                  <th>状态</th>
                  <th>出生城市</th>
                  <th>分数</th>
                  <th>最新报告</th>
                  <th>创建时间</th>
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
                        ? `事业 ${reading.fiveDimensionScore.careerScore} / 财富 ${reading.fiveDimensionScore.wealthScore} / 感情 ${reading.fiveDimensionScore.loveScore} / 健康 ${reading.fiveDimensionScore.healthScore}`
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
          <h2>最新报告</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>报告</th>
                  <th>读取</th>
                  <th>版本</th>
                  <th>创建时间</th>
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
          <h2>最新出生资料</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>资料</th>
                  <th>用户</th>
                  <th>地点</th>
                  <th>出生时间</th>
                  <th>创建时间</th>
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
          <h2>最新紫微命盘</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>命盘</th>
                  <th>出生资料</th>
                  <th>地点</th>
                  <th>引擎</th>
                  <th>流派</th>
                  <th>创建时间</th>
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
