import {
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

// Register fonts if needed, but for now we stick to standard ones for reliability
const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#2d3436",
    backgroundColor: "#ffffff",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 180,
    backgroundColor: "#1a1a1a",
    padding: 30,
    color: "#ffffff",
  },
  main: {
    marginLeft: 180,
    padding: 40,
    minHeight: "100%",
  },
  goldBar: {
    height: 5,
    backgroundColor: "#D4AF37",
    width: "100%",
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    fontSize: 12,
    color: "#D4AF37",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 25,
    fontFamily: "Helvetica-Bold",
  },
  sidebarSection: {
    marginBottom: 25,
  },
  sidebarTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#D4AF37",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1 solid #333",
    paddingBottom: 5,
    marginBottom: 10,
  },
  sidebarText: {
    fontSize: 8,
    color: "#bdc3c7",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    textTransform: "uppercase",
    borderBottom: "2 solid #D4AF37",
    paddingBottom: 5,
    marginBottom: 15,
    width: "fit-content",
  },
  entry: {
    marginBottom: 15,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  company: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#1a1a1a",
  },
  jobTitle: {
    fontSize: 10,
    color: "#D4AF37",
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 8,
    color: "#636e72",
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 4,
    lineHeight: 1.5,
    fontSize: 9,
  },
  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skillItem: {
    fontSize: 8,
    color: "#ffffff",
    backgroundColor: "#333",
    padding: "3 8",
    borderRadius: 2,
  }
});

export function PremiumGoldTemplate({ cv }: { cv: CV }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}>
        <View style={{ marginBottom: 40 }}>
           <Text style={{ fontSize: 24, fontFamily: "Helvetica-Bold", color: "#D4AF37" }}>{cv.personal.firstName[0]}{cv.personal.lastName[0]}</Text>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contact</Text>
          <Text style={styles.sidebarText}>{cv.personal.email}</Text>
          <Text style={styles.sidebarText}>{cv.personal.phone}</Text>
          <Text style={styles.sidebarText}>{cv.personal.address}</Text>
        </View>

        {cv.skills.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Expertise</Text>
            <View style={styles.skillGrid}>
              {cv.skills.map((skill, i) => (
                <View key={i} style={styles.skillItem}>
                  <Text>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Education</Text>
          {cv.education.map((edu) => (
            <View key={edu.id} style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>{edu.degree}</Text>
              <Text style={styles.sidebarText}>{edu.institution}</Text>
              <Text style={[styles.sidebarText, { color: "#D4AF37" }]}>{edu.year}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.goldBar} />
        <Text style={styles.name}>{cv.personal.firstName} {cv.personal.lastName}</Text>
        <Text style={styles.title}>{cv.experience[0]?.title || "Professional Asset"}</Text>

        {cv.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={{ lineHeight: 1.6, fontSize: 10 }}>{cv.professionalSummary}</Text>
          </View>
        )}

        {cv.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {cv.experience.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.date}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <Text style={styles.jobTitle}>{exp.title}</Text>
                {exp.bullets.map((bullet, i) => (
                  <Text key={i} style={styles.bullet}>• {bullet}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {cv.projects && cv.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {cv.projects.map((project) => (
              <View key={project.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.company}>{project.name}</Text>
                  {project.link && <Text style={styles.date}>{project.link}</Text>}
                </View>
                <Text style={{ fontSize: 9, lineHeight: 1.5, marginTop: 2 }}>{project.description}</Text>
              </View>
            ))}
          </View>
        )}

        {cv.awards && cv.awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Honors</Text>
            {cv.awards.map((award) => (
              <View key={award.id} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.company}>{award.name}</Text>
                  <Text style={styles.date}>{award.year}</Text>
                </View>
                <Text style={{ fontSize: 8, color: "#D4AF37", fontFamily: "Helvetica-Bold" }}>{award.issuer}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}
