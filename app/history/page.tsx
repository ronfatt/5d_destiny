import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

function getResumeAction(reading: {
  id: string;
  cardDraw: unknown | null;
  fiveDimensionScore: unknown | null;
  reports: Array<{ id: string }>;
}) {
  if (!reading.cardDraw) {
    return {
      href: `/card-draw?readingId=${reading.id}`,
      label: "继续抽牌"
    };
  }

  if (!reading.fiveDimensionScore || reading.reports.length === 0) {
    return {
      href: `/readings/${reading.id}`,
      label: "完成结果页"
    };
  }

  return {
    href: `/readings/${reading.id}`,
    label: "打开结果"
  };
}

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  const [birthProfiles, readings] = await Promise.all([
    prisma.birthProfile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    prisma.destinyReading.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        birthProfile: true,
        cardDraw: true,
        questionnaireResult: true,
        fiveDimensionScore: true,
        reports: { orderBy: { createdAt: "desc" }, take: 1 }
      }
    })
  ]);

  return (
    <main>
      <section className="hero heroCompact">
        <div className="eyebrow">历史记录</div>
        <h1>{user.displayName ?? user.email}</h1>
        <p>查看已保存的出生资料、已完成读取，并继续任何中断的流程。</p>
        <div className="ctaRow">
          <a className="button primary" href="/start">开始读取</a>
          <a className="button" href="/birth-profile">出生资料</a>
          <a className="button" href="/auth">账户</a>
        </div>
      </section>

      <section className="grid">
        <article className="card" style={{ gridColumn: "span 4" }}>
          <h2>出生资料</h2>
          <ul>
            {birthProfiles.length ? birthProfiles.map((profile) => (
              <li key={profile.id}>
                {profile.birthLocation} · {profile.birthTime} · {formatDate(profile.createdAt)}
              </li>
            )) : <li>还没有保存的出生资料。</li>}
          </ul>
        </article>

        <article className="card" style={{ gridColumn: "span 8" }}>
          <h2>读取记录</h2>
          <div className="tableWrap">
            <table className="dataTable">
              <thead>
                <tr>
                  <th>读取</th>
                  <th>主题</th>
                  <th>状态</th>
                  <th>分数</th>
                  <th>报告</th>
                  <th>操作</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {readings.length ? readings.map((reading) => {
                  const score = reading.fiveDimensionScore;
                  const report = reading.reports[0] ?? null;
                  const themeScore = reading.theme === "CAREER"
                    ? score?.careerScore
                    : reading.theme === "WEALTH"
                      ? score?.wealthScore
                      : reading.theme === "LOVE"
                        ? score?.loveScore
                        : score?.healthScore;
                  const resume = getResumeAction(reading);
                  const title = reading.title?.trim() || reading.question;

                  return (
                    <tr key={reading.id}>
                      <td>
                        <div className="readingTitleCell">
                          <a href={`/readings/${reading.id}`}>{title}</a>
                          <span>{reading.id.slice(0, 12)}</span>
                        </div>
                      </td>
                      <td>{reading.theme}</td>
                      <td>{reading.status}</td>
                      <td>{themeScore ?? "-"}</td>
                      <td>{report ? report.reportVersion : "-"}</td>
                      <td>
                        <a className="tableActionLink" href={resume.href}>{resume.label}</a>
                      </td>
                      <td>{formatDate(reading.createdAt)}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7}>这个账户下还没有保存任何读取记录。</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
