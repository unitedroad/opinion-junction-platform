import traceback
import sys

from allauth.account.adapter import DefaultAccountAdapter

class NewsoftheworldOJAdapter(DefaultAccountAdapter):

    def send_mail(self, template_prefix, email, context):
        try:
            msg = self.render_mail(template_prefix, email, context)
            msg.send()
        except Exception as e:
            print " Exception while sending mail in send_mail: " + str(traceback.extract_tb(sys.exc_info()[2]))  #log exception
                                                                                                                 #ignore exception
