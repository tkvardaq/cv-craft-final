import {
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#333",
  },
  sidebar: {
    width: "30%",
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    padding: 30,
    height: "100%",
  },
  main: {
    width: "70%",
    padding: 40,
    backgroundColor: "#ffffff",
  },
  sidebarName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    color: "#ffffff",
  },
  sidebarTitle: {
    fontSize: 10,
    color: "#94a3b8",
    marginBottom: 30,
    textTransform: "uppercase",
  },
  sidebarSection: {
    marginBottom: 25,
  },
  sidebarLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#38bdf8",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 1,
  },
  sidebarText: {
    fontSize: 8,
    color: "#cbd5e1",
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 15,
    borderBottom: "2 solid #38bdf8",
    width: 60,
    paddingBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  summary: {
    lineHeight: 1.6,
    color: "#475569",
    marginBottom: 10,
  },
  entry: {
    marginBottom: 15,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  company: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#38bdf8",
    marginBottom: 4,
  },
  date: {
    fontSize: 8,
    color: "#64748b",
  },
  bullet: {
    marginLeft: 8,
    marginBottom: 3,
    color: "#475569",
    lineHeight: 1.4,
  }
});

export function CreativeTemplate({ cv }: { cv: CV }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}>
        <Text style={styles.sidebarName}>{cv.personal.firstName}</Text>
        <Text style={[styles.sidebarName, { marginTop: -5 }]}>{cv.personal.lastName}</Text>
        <Text style={styles.sidebarTitle}>{cv.experience[0]?.title || "Designer"}</Text>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarLabel}>Contact</Text>
          <Text style={styles.sidebarText}>{cv.personal.email}</Text>
          <Text style={styles.sidebarText}>{cv.personal.phone}</Text>
          <Text style={styles.sidebarText}>{cv.personal.address}</Text>
        </View>

        {cv.skills.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Expertise</Text>
            {cv.skills.map((skill, i) => (
              <Text key={i} style={styles.sidebarText}>• {skill}</Text>
            ))}
          </View>
        )}

        {cv.education.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Education</Text>
            {cv.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 10 }}>
                <Text style={[styles.sidebarText, { fontFamily: "Helvetica-Bold", color: "#fff" }]}>{edu.institution}</Text>
                <Text style={styles.sidebarText}>{edu.degree}</Text>
                <Text style={[styles.sidebarText, { opacity: 0.6 }]}>{edu.year}</Text>
              </View>
            ))}
          </View>
        )}

        {cv.awards && cv.awards.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarLabel}>Awards</Text>
            {cv.awards.map((award, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={[styles.sidebarText, { fontFamily: "Helvetica-Bold", color: "#fff" }]}>{award.name}</Text>
                <Text style={styles.sidebarText}>{award.issuer}</Text>
                <Text style={[styles.sidebarText, { opacity: 0.6 }]}>{award.year}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.main}>
        {cv.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.mainTitle}>Profile</Text>
            <Text style={styles.summary}>{cv.professionalSummary}</Text>
          </View>
        )}

        {cv.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.mainTitle}>Experience</Text>
            {cv.experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.date}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={styles.company}>{exp.company}</Text>
                {exp.bullets.map((bullet, i) => (
                  <Text key={i} style={styles.bullet}>• {bullet}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {cv.projects && cv.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.mainTitle, { width: 80 }]}>Projects</Text>
            {cv.projects.map((project, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.jobTitle}>{project.name}</Text>
                  {project.link && <Text style={styles.date}>{project.link}</Text>}
                </View>
                <Text style={styles.summary}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}
