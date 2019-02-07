<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'>
	<xsl:output method='xml' indent='yes' standalone='yes'/>
	<xsl:template match='/'>
		<ivy-module version='2.0'>
			<info module='viskit' organisation='kony'/>
			<dependencies>
				<xsl:for-each select='plugins/pluginInfo'>
				<dependency rev='{@version-no}' name='{@plugin-id}'/>
				</xsl:for-each>
			</dependencies>
		</ivy-module>
	</xsl:template>
</xsl:stylesheet>
