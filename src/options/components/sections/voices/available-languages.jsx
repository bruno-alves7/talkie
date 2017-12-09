/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import React from "react";
import PropTypes from "prop-types";

import translate from "../../../../shared/hocs/translate.jsx";

import {
    getLanguageGroupsFromVoices,
    getVoicesByLanguageFromVoices,
    getVoicesByLanguageGroupFromVoices,
    getLanguagesByLanguageGroupFromVoices,
} from "../../../../shared/utils/transform-voices";

import MultilineSelect from "../../../../shared/components/form/multiline-select.jsx";

@translate
export default class AvailableLanguages extends React.PureComponent {
    constructor(props) {
        super(props);

        this.defaultAllLanguagesValue = "all-languages";

        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
        voices: [],
        value: null,
        disabled: true,
    };

    static propTypes = {
        voices: PropTypes.arrayOf(PropTypes.shape({
            default: PropTypes.bool.isRequired,
            lang: PropTypes.string.isRequired,
            localService: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            voiceURI: PropTypes.string.isRequired,
        })).isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
    };

    handleChange(newlySelectedLanguageName) {
        let languageName = null;

        if (newlySelectedLanguageName !== this.defaultAllLanguagesValue) {
            languageName = newlySelectedLanguageName;
        }

        this.props.onChange(languageName);
    }

    render() {
        const languageGroups = getLanguageGroupsFromVoices(this.props.voices);
        const voicesByLanguage = getVoicesByLanguageFromVoices(this.props.voices);
        const voicesByLanguageGroup = getVoicesByLanguageGroupFromVoices(this.props.voices);
        const languagesByLanguageGroup = getLanguagesByLanguageGroupFromVoices(this.props.voices);
        const frontendVoicesShowAllVoicesTranslated = this.props.translate("frontend_voicesShowAllVoices");

        const languagesOptions = languageGroups.reduce(
            (options, languageGroup) => {
                const newOptions = [];

                const voicesPerLanguageGroup = voicesByLanguageGroup[languageGroup];

                const languagesPerGroup = languagesByLanguageGroup[languageGroup].filter((language) => language !== languageGroup);

                let languageGroupText = null;

                if (languagesPerGroup.length > 1 || voicesPerLanguageGroup.length > 1) {
                    languageGroupText = `${languageGroup} (${languagesPerGroup.length}, ${voicesPerLanguageGroup.length})`;
                } else {
                    languageGroupText = languageGroup;
                }

                const languageGroupOptionElement
                = <option
                    key={languageGroup}
                    // TODO: proper way to store/look up objects?
                    value={languageGroup}
                    className="group"
                >
                    {languageGroupText}
                </option>;

                newOptions.push(languageGroupOptionElement);

                languagesPerGroup
                    .filter((language) => language !== languageGroup)
                    .forEach((language) => {
                        let languageText = null;

                        if (voicesByLanguage[language].length > 1) {
                            languageText = `${language} (${voicesByLanguage[language].length})`;
                        } else {
                            languageText = language;
                        }

                        const languageOptionElement
                        = <option
                            key={language}
                            // TODO: proper way to store/look up objects?
                            value={language}
                        >
                            {languageText}
                        </option>;

                        newOptions.push(languageOptionElement);
                    });

                return options.concat(newOptions);
            },
            [
                <option
                    key={this.defaultAllLanguagesValue}
                    value={this.defaultAllLanguagesValue}
                    className="group"
                >
                    {frontendVoicesShowAllVoicesTranslated}
                </option>,
            ]
        );

        return (
            <MultilineSelect
                size={7}
                onChange={this.handleChange}
                value={this.props.value || this.defaultAllLanguagesValue}
                disabled={this.props.disabled}
                className="grouped"
            >
                {languagesOptions}
            </MultilineSelect>
        );
    }
}
