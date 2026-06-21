import {
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#0A0A0A",
    color: "#FFFFFF",
    fontFamily: "Helvetica",
    padding: 0,
  },
  header: {
    backgroundColor: "#000000",
    padding: 40,
    borderBottom: "1 solid #333333",
  },
  name: {
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  lastName: {
    color: "#D4AF37",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 10,
  },
  contactItem: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  container: {
    flexDirection: "row",
    flex: 1,
  },
  sidebar: {
    width: "30%",
    backgroundColor: "#111111",
    padding: 30,
    borderRight: "1 solid #222222",
  },
  main: {
    width: "70%",
    padding: 40,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#D4AF37",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 20,
  },
  sidebarSection: {
    marginBottom: 35,
  },
  skillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillItem: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#BBBBBB",
    backgroundColor: "#1A1A1A",
    border: "1 solid #333333",
    padding: "4 8",
    borderRadius: 10,
    textTransform: "uppercase",
  },
  langItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  langName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#999999",
    textTransform: "uppercase",
  },
  dotRow: {
    flexDirection: "row",
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: "#D4AF37",
  },
  dotInactive: {
    backgroundColor: "#333333",
  },
  certItem: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#888888",
    borderLeft: "1 solid #D4AF37",
    paddingLeft: 10,
    marginBottom: 10,
    lineHeight: 1.4,
    textTransform: "uppercase",
  },
  mission: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#CCCCCC",
    fontFamily: "Helvetica-Bold", // Closest to Medium
    fontStyle: "italic",
    borderLeft: "2 solid #D4AF37",
    paddingLeft: 20,
    marginBottom: 40,
  },
  expEntry: {
    marginBottom: 35,
    paddingLeft: 20,
    borderLeft: "1 solid #222222",
    position: "relative",
  },
  expMarker: {
    position: "absolute",
    left: -3,
    top: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D4AF37",
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  expTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  expCompany: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#D4AF37",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  expDate: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#444444",
    textTransform: "uppercase",
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 5,
  },
  bulletPoint: {
    color: "#D4AF37",
    fontSize: 9,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 9,
    color: "#888888",
    lineHeight: 1.5,
  },
  projectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  projectCard: {
    width: "47%",
    padding: 15,
    backgroundColor: "#111111",
    border: "1 solid #222222",
    borderRadius: 4,
  },
  projectName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 5,
    color: "#FFFFFF",
  },
  projectDesc: {
    fontSize: 8,
    color: "#666666",
    lineHeight: 1.4,
  },
  eduGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  eduItem: {
    width: "45%",
    borderLeft: "1 solid #222222",
    paddingLeft: 15,
  },
  eduDegree: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  eduInst: {
    fontSize: 8,
    color: "#444444",
    marginTop: 2,
    textTransform: "uppercase",
  },
  eduYear: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#D4AF37",
    marginTop: 5,
  }
});

export function ObsidianTemplate({ cv, isPremium = false }: { cv: CV; isPremium?: boolean }) {
  const { personal, professionalSummary, experience, education, skills, certifications, languages, projects, awards } = cv;

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {personal.firstName} <Text style={styles.lastName}>{personal.lastName}</Text>
        </Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactItem}>{personal.email}</Text>
          <Text style={styles.contactItem}>{personal.phone}</Text>
          <Text style={styles.contactItem}>{personal.address}</Text>
          {personal.linkedin && <Text style={styles.contactItem}>{personal.linkedin}</Text>}
        </View>
      </View>

      <View style={styles.container}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Skills */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sectionTitle}>Expertise</Text>
            <View style={styles.skillGrid}>
              {skills.map((skill, i) => (
                <View key={i} style={styles.skillItem}>
                  <Text>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Languages */}
          {languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {languages.map((lang, i) => (
                <View key={i} style={styles.langItem}>
                  <Text style={styles.langName}>{lang}</Text>
                  <View style={styles.dotRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <View key={s} style={[styles.dot, s <= 4 ? styles.dotActive : styles.dotInactive]} />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sectionTitle}>Accreditation</Text>
              {certifications.map((cert, i) => (
                <Text key={i} style={styles.certItem}>{cert}</Text>
              ))}
            </View>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sectionTitle}>Distinction</Text>
              {awards.map((award, i) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <Text style={[styles.eduDegree, { fontSize: 8 }]}>{award.name}</Text>
                  <Text style={[styles.eduInst, { fontSize: 7, color: "#666" }]}>{award.issuer}</Text>
                  <Text style={[styles.eduYear, { fontSize: 7, marginTop: 2 }]}>{award.year}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Summary */}
          {professionalSummary && (
            <View>
              <Text style={styles.sectionTitle}>Mission</Text>
              <Text style={styles.mission}>{professionalSummary}</Text>
            </View>
          )}

          {/* Experience */}
          <View>
            <Text style={styles.sectionTitle}>Performance</Text>
            {experience.map((exp, i) => (
              <View key={i} style={styles.expEntry}>
                <View style={styles.expMarker} />
                <View style={styles.expHeader}>
                  <View>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                  </View>
                  <Text style={styles.expDate}>{exp.startDate} — {exp.endDate}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  {exp.bullets.map((bullet, j) => (
                    <View key={j} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Special Ops</Text>
              <View style={styles.projectGrid}>
                {projects.map((project, i) => (
                  <View key={i} style={styles.projectCard}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectDesc}>{project.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Education */}
          <View style={{ marginTop: 40 }}>
            <Text style={styles.sectionTitle}>Foundation</Text>
            <View style={styles.eduGrid}>
              {education.map((edu, i) => (
                <View key={i} style={styles.eduItem}>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  <Text style={styles.eduInst}>{edu.institution}</Text>
                  <Text style={styles.eduYear}>{edu.year}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    
      {!isPremium && <Text style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", fontSize: 8, color: "#9ca3af" }}>Created with CvCRAFT.uk</Text>}
    </Page>
  );
}
