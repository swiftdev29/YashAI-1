import React from 'react';
import ReactMarkdown from 'react-markdown';
import TagManager from 'react-gtm-module';
import { Constants } from 'librechat-data-provider';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useLocalize } from '~/hooks';

export default function Footer({ className }: { className?: string }) {
  const { data: config } = useGetStartupConfig();
  const localize = useLocalize();

  const privacyPolicy = config?.interface?.privacyPolicy;
  const termsOfService = config?.interface?.termsOfService;

  const privacyPolicyRender = privacyPolicy?.externalUrl != null && (
    <a
      className="text-text-secondary underline"
      href={privacyPolicy.externalUrl}
      target={privacyPolicy.openNewTab === true ? '_blank' : undefined}
      rel="noreferrer"
    >
      {localize('com_ui_privacy_policy')}
    </a>
  );

  const termsOfServiceRender = termsOfService?.externalUrl != null && (
    <a
      className="text-text-secondary underline"
      href={termsOfService.externalUrl}
      target={termsOfService.openNewTab === true ? '_blank' : undefined}
      rel="noreferrer"
    >
      {localize('com_ui_terms_of_service')}
    </a>
  );

  if (config?.analyticsGtmId != null) {
    const tagManagerArgs = {
      gtmId: config.analyticsGtmId,
    };
    TagManager.initialize(tagManagerArgs);
  }

  const mainContentParts = (
    typeof config?.customFooter === 'string'
      ? config.customFooter
      : '[YashAI ' +
        Constants.VERSION +
        ']() - ' +
        localize('com_ui_latest_footer')
  ).split('|');

  const mainContentRender = mainContentParts.map((text, index) => (
    <React.Fragment key={`main-content-part-${index}`}>
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node: _n, href, children, ...otherProps }) => {
            return (
              <a
                className="text-text-secondary underline"
                href={href}
                target="_blank"
                rel="noreferrer"
                {...otherProps}
              >
                {children}
              </a>
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({ node: _n, ...props }) => <span {...props} />,
        }}
      >
        {text.trim()}
      </ReactMarkdown>
    </React.Fragment>
  ));

  const footerElements = [...mainContentRender, privacyPolicyRender, termsOfServiceRender].filter(
    Boolean,
  );

  return (
    <div
      className={
        className ??
        'relative flex items-center justify-center gap-2 px-2 py-2 text-center text-xs text-text-primary md:px-[60px]'
      }
      role="contentinfo"
    >
      {footerElements.map((contentRender, index) => {
        const isLastElement = index === footerElements.length - 1;
        return (
          <React.Fragment key={`footer-element-${index}`}>
            {contentRender}
            {!isLastElement && (
              <div key={`separator-${index}`} className="h-2 border-r-[1px] border-border-medium" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
